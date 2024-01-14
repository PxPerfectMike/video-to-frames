import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const VideoUpload = () => {
	const [frameUrls, setFrameUrls] = useState([]);
	const [uploadProgress, setUploadProgress] = useState('');

	const onDrop = useCallback((acceptedFiles) => {
		setUploadProgress('Uploading...');
		const file = acceptedFiles[0];
		const formData = new FormData();
		formData.append('videoFile', file);

		fetch('http://localhost:3000/upload', {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				setFrameUrls(data.frames);
				setUploadProgress('Processing complete');
			})
			.catch((error) => {
				setUploadProgress('Error in processing');
			});
	}, []);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<div>
			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<p>
					Drag 'n' drop a video file here, or click to select a file
				</p>
			</div>
			<p>{uploadProgress}</p>
			<div>
				{frameUrls.map((url, index) => (
					<a key={index} href={url} download>
						Download Frame {index + 1}
					</a>
				))}
			</div>
		</div>
	);
};

export default VideoUpload;
