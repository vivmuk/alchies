// Netlify serverless function for handling image uploads
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'di1nyp1bb',
  api_key: '797786557437997',
  api_secret: 'OERwE_u2Cik88JtQk57eLSiLfos',
  secure: true
});

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
    const body = JSON.parse(event.body);
    const imageData = body.image; // Base64 encoded image
    
    // Check if Cloudinary credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary credentials not configured. Using fallback image URLs.');
      // Fallback to mock URLs if Cloudinary is not configured
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
    }
    
    // The unique ID for the image
    const uniqueFileName = `alchies-event-${uuidv4()}`;
    
    console.log('Uploading image to Cloudinary...');
    
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageData, {
      folder: 'alchies-events',
      public_id: uniqueFileName,
      resource_type: 'image',
      // Optional transformations
      transformation: [
        { width: 1000, crop: 'limit' }, // Resize to max width of 1000px
        { quality: 'auto:good' } // Auto-optimize quality
      ]
    });
    
    console.log('Image uploaded successfully to Cloudinary');
    
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
    
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
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