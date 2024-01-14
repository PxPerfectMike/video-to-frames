import React from 'react';
import VideoUpload from './VideoUpload'; // Assuming you have a VideoUpload component

function App() {
	return (
		<div className='App'>
			<header className='App-header'>
				<h1>Video to Frames Converter</h1>
				<VideoUpload />
				{/* You can also add components or elements here to display downloaded frames */}
			</header>
		</div>
	);
}

export default App;
