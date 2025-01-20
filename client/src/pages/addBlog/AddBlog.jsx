import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import './AddBlog.css';
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";


import { AiFillCloseCircle } from "react-icons/ai";
import ClockLoader from "react-spinners/ClockLoader";

const AddBlog = () => {
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();


const checkLogin = async () => {
  try {
      const authToken = localStorage.getItem("authToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!authToken || !refreshToken) {
        toast.error("Missing authentication tokens. Redirecting to login.", { position: "top-right", autoClose: 3000 });
        navigate("/auth/signin");
        return; // Exit the function without throwing an error
    }

      const apiUrl = `${import.meta.env.VITE_REACT_APP_BACKEND_API}/auth/checklogin`;

      const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
              "x-refresh-token": refreshToken,
          },
      });

      if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const response = await res.json();

      if (response.newAuthToken || response.newRefreshToken) {
          localStorage.setItem("authToken", response.newAuthToken || authToken);
          localStorage.setItem("refreshToken", response.newRefreshToken || refreshToken);
      }

      if (response.ok) {
          // setAuth(true);
          console.log("Authentication successful.");
      } else {
          // setAuth(false);
          // throw new Error(response.message || "Authentication failed");
          toast.error(response.message || "Authentication failed. Redirecting to login.", { position: "top-right", autoClose: 3000 });
          navigate("/auth/signin")
      }
  } catch (error) {
      console.error("Error details:", error.message);

      // Clear tokens if login fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");

      toast.error("You need to log in first!", { position: "top-right", autoClose: 3000 });
      navigate("/auth/signin");
  }
};

const [blog, setBlog] = useState({
  title: '',
  description: '',
  image: null, // Will hold the uploaded file (if any)
  imageUrl: '',
  paragraphs: [], // Array to store paragraph data
  category: '',
});

const [categories,setCategories] = useState([]);

const getCategories = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_API}/blogcategories`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setCategories(data.categories); // Assuming response has a 'categories' field
  } catch (error) {
    console.error("Error fetching categories:", error.message);
  }
};


useEffect(()=>{
getCategories();
},[]);

const [paragraphForm, setParagraphForm] = useState({
  title: '',
  description: '',
  image: null, // To hold the file object if an image is uploaded
  imageUrl: '', // To store the URL of the image
  position: '', // A string for the position
  createdAt: null, // Can be used to store a date if required
});

const pushParagraphToBlog = () => {
  let tempPg = paragraphForm
  tempPg.createdAt = new Date().getTime();
  setBlog({
    ...blog,
    paragraphs: [
      ...blog.paragraphs, paragraphForm
    ]
  })

  let nextPosition = String(parseInt(paragraphForm.position) + 1);
  setParagraphForm({
    ...paragraphForm,
    title: '',
    description: '',
    position: nextPosition,
    createdAt: null
  })
}
const deleteParagraph = (paragraph) => {
  const updatedParagraphs = blog.paragraphs.filter((p) => p.createdAt !== paragraph.createdAt);
  setBlog({
    ...blog,
    paragraphs: updatedParagraphs,
  });
};

const sortParagraphs = (a, b) => {
  if (a.position === b.position) {
    return b.createdAt - a.createdAt;
  }
  return a.position.localeCompare(b.position);
};

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append('myimage', image);

    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_API}/image/uploadimage`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Image uploaded successfully:', data);
      return data.imageUrl; // Return the URL for further use.
    } else {
      console.error('Failed to upload the image.');
      return null; // Handle upload failure.
    }

  } catch (error) {
    console.error('Error:', error); // Log unexpected errors.
    return null; // Return null for consistent error handling.
  }
};

const uploadBlog = async()=>{
  checkLogin();
  if (!blog.title || !blog.description || !blog.category) {
    // Handle the case where required fields are missing
    toast.error("Please fill in all required fields.");
    return;
  }
  setLoading(true)

  let tempblog = blog
  if (blog.image) {
    let imgUrl = await uploadImage(blog.image)
    tempblog.imageUrl = imgUrl
    // console.log(tempblog)
    setLoading(false)
  }
  for (let i = 0; i < tempblog.paragraphs.length; i++) {
    let tempimg = tempblog.paragraphs[i].image
    if (tempimg) {
      let imgURL = await uploadImage(tempimg);
      tempblog.paragraphs[i].imageUrl = imgURL;
    }
  }

  console.log('BEFORE UPLOADING ' , blog);
  try {
    const authToken = localStorage.getItem('authToken'); // Retrieve the auth token
    const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the refresh token

    if (!authToken || !refreshToken) {
      toast.error('Authentication tokens are missing!');
      setLoading(false);
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_API}/blog/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // Add auth token in the Authorization header
        'x-refresh-token': refreshToken, // Add refresh token in a custom header
      },
      body: JSON.stringify(blog),
    });

    if (response.ok) {
      const data = await response.json();
      toast.success('Blog post created successfully');
      console.log('Blog post created successfully:', data);
      setLoading(false);

      // Optionally, you can navigate to another page or reset the form here.
    } else {
      console.log("response is here",response);
      
      toast("failed to create the post")
      setLoading(false);
      
    }
  } catch (error) {
    toast.error(`An unexpected error occurred: ${error.message}`);
    console.error('Unexpected error:', error);
  } 

}


useEffect(()=>{
console.log(blog);

},[blog])


  return (
    <div className='addblog_in'>
       {
        loading &&
        <div className='loaderfullpage'>
          <ClockLoader
            color="#36d7b7"
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      }
    <Navbar />
    <h1 className='head1'>AddBlog</h1>
    <form style={{
          width: '70%',
          minWidth: '250px',
          display: 'flex',
          flexDirection: 'column',
        }}>

          <div className='forminput_cont'>
            <label>Blog Name</label>
            <input type="text" placeholder='enter blog title' value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}/>
          </div>
          <div className='forminput_cont'>
            <label>Blog Category</label>
            <select
              value={blog.category} // Set the selected category value
              onChange={(e) => setBlog({ ...blog, category: e.target.value })} // Update the selected category
            >
              <option value="">Select a category</option> {/* Default option */}
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>


          <div className='forminput_cont'>
            <label>Blog Description</label>
            <textarea  placeholder='enter blog description'  value={blog.description}
              onChange={(e) => setBlog({ ...blog, description: e.target.value })}/>
          </div>
          <div className='forminput_cont'>
            <label>blog image</label>
            <input type="file"
              onChange={(e) => {
                const selectedImage = e.target.files?.[0];// Get the selected image file
                if (selectedImage) {
                  setBlog({ ...blog, image: selectedImage }); // Update the paragraphImage state with the URL
                }
              }}
            />
          </div>

          <div className='blogtempparagraphs'>
            {
              blog.paragraphs.sort(sortParagraphs).map((paragraph) => (
                <div key={String(paragraph.createdAt)}>
                  <AiFillCloseCircle className="closebtn"
                    onClick={() => {
                      deleteParagraph(paragraph)
                    }}
                  />

                  <div className='section1'>
                    <h1>{paragraph.title}</h1>
                    <p>{paragraph.description}</p>
                  </div>
                  {paragraph.image && <img src={URL.createObjectURL(paragraph.image)} alt={`Image for ${paragraph.title}`} />}
                </div>
              ))
            }
          </div>

          <div className='paragraph' >
            <div className='forminput_cont'>
              <label>Paragraph Position</label>
              <input type="number"
                value={paragraphForm.position}

                placeholder="Enter paragraph Position"
                onChange={(e) => setParagraphForm({ ...paragraphForm, position: e.target.value })} />
            </div>
            <div className='forminput_cont'>
              <label>Paragraph Title</label>
              <input type="text" value={paragraphForm.title} placeholder="Enter paragraph Title" onChange={(e) => setParagraphForm({ ...paragraphForm, title: e.target.value })} />
            </div>
            <div className='forminput_cont'>
              <label>Paragraph Description</label>
              <textarea placeholder="Enter Paragraph Description" value={paragraphForm.description} onChange={(e) => setParagraphForm({ ...paragraphForm, description: e.target.value })} />
            </div>
            <div className='forminput_cont'>
              <label>Paragraph Image</label>
              <input type="file"
                id='pgimg'
                onChange={(e) => {
                  const selectedImage = e.target.files?.[0];// Get the selected image file
                  if (selectedImage) {
                    // const imageUrl = URL.createObjectURL(selectedImage); // Create a URL for the selected image
                    setParagraphForm({ ...paragraphForm, image: selectedImage }); // Update the paragraphImage state with the URL
                  }
                }}
              />
            </div>


            <button type="button" className="main_button" onClick={(e) => {
              e.preventDefault(); // Prevent the default form submission
              pushParagraphToBlog();
            }}>Add Paragraph To Blog</button>
          </div>

          <button type="submit" className="main_button"  onClick={(e) => {
              e.preventDefault(); // Prevent the default form submission
              uploadBlog();
            }}>Submit</button>

        </form>
    </div>
  )
}

export default AddBlog