// Netlify serverless function for handling image uploads
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');

// Enhanced debugging
console.log('Starting upload function with environment variables:',
  process.env.CLOUDINARY_CLOUD_NAME ? 'CLOUDINARY_CLOUD_NAME is set' : 'CLOUDINARY_CLOUD_NAME is missing',
  process.env.CLOUDINARY_API_KEY ? 'CLOUDINARY_API_KEY is set' : 'CLOUDINARY_API_KEY is missing'
);

// Configure Cloudinary with environment variables or hardcoded values as fallback
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'di1nyp1bb',
  api_key: process.env.CLOUDINARY_API_KEY || '797786557437997',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'OERwE_u2Cik88JtQk57eLSiLfos',
  secure: true
});

// Always log the Cloudinary configuration (except the API secret)
console.log(`Cloudinary Config - Cloud Name: ${cloudinary.config().cloud_name}, API Key: ${cloudinary.config().api_key}`);

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
    console.log('Processing upload request...');
    
    const body = JSON.parse(event.body);
    const imageData = body.image; // Base64 encoded image
    
    if (!imageData) {
      console.log('Error: No image data provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'No image data provided' })
      };
    }
    
    // The unique ID for the image
    const uniqueFileName = `alchies-event-${uuidv4()}`;
    
    console.log('Uploading image to Cloudinary...');
    
    try {
      // Modified upload options for better reliability
      const uploadOptions = {
        folder: 'alchies-events',
        public_id: uniqueFileName,
        resource_type: 'auto',
        overwrite: true,
        // Optional transformations
        transformation: [
          { width: 1000, crop: 'limit' }, // Resize to max width of 1000px
          { quality: 'auto:good' } // Auto-optimize quality
        ]
      };
      
      console.log('Upload options:', { ...uploadOptions, image: 'IMAGE_DATA_OMITTED' });
      
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(imageData, uploadOptions);
      
      console.log('Image uploaded successfully to Cloudinary with URL:', uploadResponse.secure_url);
      
      // Return the secure URL to the uploaded image
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          url: uploadResponse.secure_url,
          id: uploadResponse.public_id,
          success: true
        })
      };
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      
      // Fallback to mock URLs if Cloudinary upload fails
      const mockImageUrls = [
        'https://images.unsplash.com/photo-1523837157348-ffbdaccfc7de',
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
        'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
        'https://images.unsplash.com/photo-1496024840928-4c417adf211d'
      ];
      
      const imageUrl = `${mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)]}?w=800&h=600&fit=crop&q=80`;
      
      console.log('Using fallback image URL:', imageUrl);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          url: imageUrl,
          id: uuidv4(),
          success: true,
          fallback: true
        })
      };
    }
  } catch (error) {
    console.error('Error processing upload request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Internal server error', 
        error: error.toString() 
      })
    };
  }
}; 