import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import archiver from 'archiver'; // Import archiver

// Define __dirname in ES6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the correct path

app.post('/upload', (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	let videoFile = req.files.videoFile;
	let uploadPath = path.join(__dirname, 'uploads', videoFile.name);

	videoFile.mv(uploadPath, function (err) {
		if (err) {
			return res.status(500).send(err);
		}

		const framesDir = path.join(__dirname, 'public', 'frames');
		if (!fs.existsSync(framesDir)) {
			fs.mkdirSync(framesDir, { recursive: true });
		}

		const ffmpeg = spawn('ffmpeg', [
			'-i',
			uploadPath,
			'-vf',
			'fps=1',
			path.join(framesDir, 'frame_%03d.png'),
		]);

		ffmpeg.on('close', (code) => {
			if (code !== 0) {
				return res.status(500).send('Error processing video');
			}

			// Create a zip file of the frames
			const zipPath = path.join(__dirname, 'public', 'frames.zip');
			const output = fs.createWriteStream(zipPath);
			const archive = archiver('zip', {
				zlib: { level: 9 }, // Compression level
			});

			output.on('close', function () {
				res.json({ zipFile: `http://localhost:3000/frames.zip` });
			});

			archive.on('error', function (err) {
				throw err;
			});

			archive.pipe(output);
			archive.directory(framesDir, false);
			archive.finalize();
		});
	});
});

app.listen(3000, () => {
	console.log('Server started on http://localhost:3000');
});
