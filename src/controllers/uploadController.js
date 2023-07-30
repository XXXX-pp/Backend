import {v2 as cloudinary} from 'cloudinary';

export const uploadFile = async (req,res)=>{
    
    cloudinary.config({ 
        cloud_name: 'dbdbmbyee', 
        api_key: '551232288565452', 
        api_secret: 'm9asQFixc7g-egr9R8tCOZFQ56Q' 
    });

    cloudinary.uploader.upload(
        "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
        { public_id: "olympic_flag" }
    )
    .then(result=>console.log(result));
    
    res.json({
        status: "success",
    })
}



