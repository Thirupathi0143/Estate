import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Listings() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState();
  const [listings, setListings] = useState();
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`, { method: "GET" });
        const data = await res.json();

        if (data.success === false) {
          console.warn(data.message);
        }

        setUserListings(data.listings);
        setListings(data.listings);
      } catch (error) {
        console.warn(error.message);
      }
    }
    fetchListings();
  }, []);


  useEffect(() => {
    if (userListings && userListings.length == 0) 
      setIsAvailable(false);
    else 
      setIsAvailable(true);
  });

  async function handleDeleteListing(listingId) {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE"
      });

      let data = null;
      if (res.status != 204) {
        data = await res.json();
      }

      if (data && data.success === false) {
        console.warn(data.message);
        return;
      }

      setUserListings((preUserListings) => {
        setListings((preListings) => {
          return preListings.filter((listing) => listing._id !== listingId);
        });
        return preUserListings.filter((listing) => listing._id !== listingId);
      });


    } catch (error) {
      console.warn(data.error);
    }
  }


  function sortListings(searchString) {
    searchString = searchString.toLowerCase().trim();
    setListings(userListings);
    if (searchString.length > 0) {
      setListings((preListing) => {
        return preListing.filter((listing) => listing.name.toLowerCase().includes(searchString))
      });
    }
  }

  return (
    <React.Fragment>
      {
        !isAvailable && userListings && <p className="font-semibold text-[20px] text-slate-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          No listings available. Please go back and create your own listing. <br/>
          <Link to="/create-listing" className="font-semibold text-blue-700 text-[18px]">Create Listing . . . .</Link>
        </p>
      }

      {
        isAvailable && userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-3 mt-6 mb-4 w-full items-center">
            <p className=" font-semibold text-center text-2xl">Your Listings</p>
            <div className="bg-white w-[91%] mx-auto sm:max-w-3xl h-12 rounded-lg flex item-center border border-slate-300">
              <input
                placeholder="Search . . ."
                className="focus:outline-none font-semibold w-full h-ful rounded-lg ml-5 text-slate-600"
                onChange={(event) => sortListings(event.target.value)}
                style={{ textIndent: "5px" }}
              />
              <FaSearch className="text-slate-600 h-full mr-6 w-5"></FaSearch>
            </div>
            {listings.length <= 0 && <p className="text-center font-semibold text-red-600">No listings are available . . . .</p>}
          </div>
        )
      }

      <div className="flex flex-wrap p-3 gap-4 mt-5 max-w-6xl mx-auto">
        {
            isAvailable && listings &&  listings.map((listing) => {
            return (
              <ListingItem
                key={listing._id}
                listing={listing} handlers={"temp"}
              >
                <Link to={`/update-listing/${listing._id}`} >
                  <button className="text-green-600">Edit</button>
                </Link>
                <button className="text-red-700" onClick={() => handleDeleteListing(listing._id)}>Delete</button>
              </ListingItem>
            );
          })
        }
      </div>
    </React.Fragment>
  );
}