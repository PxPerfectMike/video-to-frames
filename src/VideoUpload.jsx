import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Lottie from 'react-lottie';
import PageFlip from './PageFlip';

const VideoUpload = () => {
	const [zipFileUrl, setZipFileUrl] = useState('');
	const [uploadProgress, setUploadProgress] = useState('');
	const [fps, setFps] = useState('');

	const onDrop = useCallback(
		(acceptedFiles) => {
			setUploadProgress('Uploading...');
			const file = acceptedFiles[0];
			const formData = new FormData();
			formData.append('videoFile', file);
			formData.append('fps', fps);

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
		},
		[fps]
	);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	const lottieOptions = {
		loop: true,
		autoplay: true,
		animationData: PageFlip,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	return (
		<div className='main-wrapper' style={{ width: '100%' }}>
			<div {...getRootProps()}>
				{fps > 1 && <input {...getInputProps()} />}
				<p
					style={{
						display: 'flex',
						justifyContent: 'center',
						border: '2px solid black',
						width: '160px',
						padding: '10% 0',
						textWrap: 'nowrap',
					}}
				>
					drop video file here
				</p>
			</div>
			<input
				type='number'
				value={fps}
				onChange={(e) => setFps(e.target.value)}
				placeholder='Frames per second'
			/>
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
							onClick={() => (window.location.href = zipFileUrl)}
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
