import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const VideoUpload = () => {
	const [zipFileUrl, setZipFileUrl] = useState('');
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
				setZipFileUrl(data.zipFile);
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
			{zipFileUrl && (
				<div>
					<a href={zipFileUrl} download>
						Download All Frames
					</a>
				</div>
			)}
		</div>
	);
};

export default VideoUpload;
