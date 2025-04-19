// Netlify serverless function for handling image uploads
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS enabled' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // In a real app, you would:
    // 1. Parse the multipart form data
    // 2. Upload the image to a storage service like AWS S3, Cloudinary, etc.
    // 3. Return the URL to the stored image
    
    // For this demo, we'll simulate a successful upload and return a placeholder URL
    // In a real application, you'd process the actual file upload
    const body = JSON.parse(event.body);
    const imageData = body.image; // This would be a base64 encoded image in a real app
    
    // Simulate storing the image and getting back a URL
    // In a real app, you'd upload to S3, Cloudinary, etc.
    const mockImageUrls = [
      'https://images.unsplash.com/photo-1523837157348-ffbdaccfc7de',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
      'https://images.unsplash.com/photo-1496024840928-4c417adf211d'
    ];
    
    const imageUrl = `${mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)]}?w=800&h=600&fit=crop&q=80`;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: imageUrl,
        id: uuidv4(),
        success: true
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error', error: error.toString() })
    };
  }
}; 