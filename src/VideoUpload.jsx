import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Lottie from 'react-lottie';
import PageFlip from './PageFlip';

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

	const lottieOptions = {
		loop: true,
		autoplay: true,
		animationData: PageFlip, // Ensure this is the correct imported JSON data
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	return (
		<div className='main-wrapper' style={{}}>
			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<p>
					Drag 'n' drop a video file here, or click to select a file
				</p>
			</div>
			<p>{uploadProgress}</p>

			{zipFileUrl && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div
						className='downloadModal'
						style={{ display: 'flex', flexDirection: 'column' }}
					>
						{uploadProgress && <Lottie options={lottieOptions} />}
						<button
							className='animated-button'
							onclick={() => (window.location.href = zipFileUrl)}
						>
							Download All Frames
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default VideoUpload;
