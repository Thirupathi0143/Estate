import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../utils/firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [ imageFiles, setImageFiles ] = useState([]);
  const [ imgUploadMessage, setImgUploadMessage ] = useState("");
  const [ message, setMessage ] = useState("");
  const [ loading, setLoading ] = useState(false);
  const params = useParams();
  const [ formData, setFormData ] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });


  useEffect(() => {
    const fetchListing = async () => {
      const id = params.id;
      const res = await fetch(`/api/listing/get/${id}`, {
        method: "GET"
      });
      const data = await res.json();
      
      if (data.status === false) {
        console.warn(data.message);
      }
      setFormData(data.listing);
    }

    fetchListing();
  }, []);


  
  async function handleImageUpload() {
    if (imageFiles.length == 0) {
      setImgUploadMessage("Please select at least one image and a maximum of six images . . . .");
      return;
    }

    for (let imageFile of imageFiles) {
      if ((imageFile.size / 1024) > 2048) {
        setImgUploadMessage(`Error message: ${imageFile.name} file size must be less than 2MB!`);
        return;
      }
    }

    if (imageFiles.length > 0 && imageFiles.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let imageFile of imageFiles) {
        promises.push(storeImage(imageFile));
      }

      Promise.all(promises)
        .then((urls) => {
          setImgUploadMessage("Finished . . . .");
          setFormData((preFormData) => {
            return { ...preFormData, imageUrls: preFormData.imageUrls.concat(urls)};
          });
        })
        .catch(() => setImgUploadMessage("Error: All image must be less than 2MB!"));
    } 
    else {
      setImgUploadMessage("You can only upload 6 images per listing . . . .");
    }
  }

  async function storeImage(imageFile) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on("state_changed",
        (snapshot) => {
          // const progress = (Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          setImgUploadMessage(`Uploading . . . .`);
        }, 
        (error) => { // error
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => resolve(downloadURL));
        }
      );
    });
  }

  function handleRemoveImage(imgToDeleteIndex) {
    setFormData((preFormData) => {
      return { ...preFormData, imageUrls: preFormData.imageUrls.filter((_, index) => index !== imgToDeleteIndex)};
    });
  }


  function onChangeEventHandler(event) {
    if (event.target.id === "sale" || event.target.id == "rent") {
      setFormData((preFormData) => {
        return { ...preFormData, type: event.target.id};
      });
    }

    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "offer" 
    ) {
      setFormData((preFormData) => {
        return { ...preFormData, [event.target.id]: event.target.checked};
      });
    }

    if (
      event.target.type === "text" ||
      event.target.type === "textarea" ||
      event.target.type === "number"
    ) {
      setFormData((preFormData) => {
        return { ...preFormData, [event.target.id]: event.target.value};
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setImgUploadMessage("Error: You must upload at least one image . . . .");
        return;
      }

      if (+formData.regularPrice <= +formData.discountPrice) {
        setMessage("Error: Discount price must be lower than regular price . . . .");
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id})
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        if (data.message.includes("Listing validation failed"))
          return setMessage("Error: Please ensure you fill in all necessary inputs . . . .");
        else 
          return setMessage("Error: " + data.message);
      }
      navigate(`/listing/${data.listing._id}`);     
    } catch (error) {
      setLoading(false);
      setMessage("Error: " + error.message);
    }
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-700 text-center my-7">Edit a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            id="name"
            type="text"
            placeholder="Name . . . ."
            className="border border-gray-300 p-3 rounded-lg outline-none focus:border-green-600 focus:outline-none font-semibold"
            maxLength="65"
            minLength="10"
            required
            value={formData.name}
            onChange={onChangeEventHandler}
          />
          <textarea
            id="description"
            type="text"
            placeholder="Description . . . ."
            className="border border-gray-300 p-3 rounded-lg outline-none focus:border-green-600 focus:outline-none font-semibold"
            required
            value={formData.description}
            onChange={onChangeEventHandler}
          ></textarea>
          <textarea
            id="address"
            type="text"
            placeholder="Address . . . ."
            className="border border-gray-300 p-3 rounded-lg outline-none focus:border-green-600 focus:outline-none font-semibold"
            required
            value={formData.address}
            onChange={onChangeEventHandler}
          ></textarea>

          <div className="flex flex-row flex-wrap gap-4">
            <div className="flex gap-1">
              <input 
                type="checkbox" 
                id="sale" 
                className="w-5"
                checked={formData.type === "sale"}
                onChange={onChangeEventHandler}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-1">
              <input 
                type="checkbox" 
                id="rent" 
                className="w-5"
                checked={formData.type === "rent"}
                onChange={onChangeEventHandler}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-1">
              <input 
                type="checkbox" 
                id="parking" 
                className="w-5"
                value={formData.parking}
                onChange={onChangeEventHandler}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-1">
              <input 
                type="checkbox" 
                id="furnished" 
                className="w-5"
                value={formData.furnished}
                onChange={onChangeEventHandler}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-1">
              <input 
                type="checkbox" 
                id="offer" 
                className="w-5"
                value={formData.offer}
                onChange={onChangeEventHandler}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-row gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <input 
                type="number" 
                id="bedrooms" 
                min="1" max="10" required 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-semibold w-24"
                value={formData.bedrooms}
                onChange={onChangeEventHandler}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-1">
              <input 
                type="number" 
                id="bathrooms" 
                min="1" max="10" required 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-semibold  w-24"
                value={formData.bathrooms}
                onChange={onChangeEventHandler}
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-1">
              <input 
                type="number" 
                id="regularPrice" 
                min="50" required 
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-semibold  w-24"
                value={formData.regularPrice}
                onChange={onChangeEventHandler}
              />
              <div className="flex flex-col text-center">
                <p>Regular price</p> 
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {
              formData.offer && (
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    id="discountPrice" 
                    min="0" required 
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-semibold  w-24"
                    value={formData.discountPrice}
                    onChange={onChangeEventHandler}
                  />
                  <div className="flex flex-col text-center">
                    <p>Discounted price</p> 
                    <span className="text-xs">($ / month)</span>
                  </div>
                </div>
              )
            }
          </div>

        </div>

        <div className="flex flex-col flex-1 gap-2">
          <p className="font-semibold">Images: 
            <span className="font-normal text-gray-600 pl-2"> The first image will be the cover (max 6)</span>
          </p>

          <div className="flex gap-3 m-1">
            <input 
              type="file" 
              id="images"  
              accept="image/*" 
              multiple 
              className="p-3 rounded w-full border border-gray-500"
              onChange={(event) => setImageFiles(event.target.files)}
            />
            <button 
              type="button"
              className="uppercase rounded-lg p-3 bg-green-600 text-white font-semibold hover:shadow-lg hover:opacity-85 disabled:opacity-70 tracking-wider" 
              onClick={handleImageUpload}
              disabled={imgUploadMessage.includes("Uploading")}
            >
              Upload
            </button>
          </div>
          {
            imgUploadMessage.includes("Error") ? <span className="text-red-600 text-xxs font-semibold">{imgUploadMessage}</span> : <span className="text-slate-600 text-xxs font-semibold">{imgUploadMessage}</span>
          }
          {
            formData.imageUrls.map((url, index) => {
              return (
                <div key={url} className="flex p-3 border border-gray-300 rounded-lg justify-between items-center">
                  <img 
                    src={url}
                    alt="Loading"
                    className="h-25 w-20 object-contain rounded-lg"
                  />
                  <button 
                    type="button"
                    className="h-10 px-2 bg-red-600 text-white font-semibold tracking-wider rounded-lg uppercase hover:opacity-75"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          }

          {
            message.includes("Error") && <span className="text-red-600 text-xxs font-semibold">{message}</span>
          }
          <button 
            className="p-3 bg-slate-700 rounded-lg text-white tracking-wider font-semibold uppercase hover:opacity-85 disabled:opacity-85"
            onClick={handleSubmit}
            disabled={loading || imgUploadMessage.includes("Uploading")}
          >
            { loading ? "Loding . . ." : "Edit Listing" }
          </button>
        </div>

      </form>
    </main>
  );
}
