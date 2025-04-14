import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const [contact, setContact] = useState(false);

  useEffect(() => {
    try {
      const fetchListing = async () => {
        const id = params.id;
        setLoading(true);
        const res = await fetch(`/api/listing/get/${id}`, {
          method: "GET"
        });
        const data = await res.json();

        if (data.success === false) {
          setLoading(false);
          setErr(true);
        }
        setListing(data.listing);
        setLoading(false);
      }
      fetchListing();
    } catch (error) {
      setLoading(false);
      setErr(true);
    }
  }, []);

  return (
    <main>
      {
        loading ? <p className="text-2xl font-semibold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Loading . . . .</p> : " "
      }
      {
        err ? <p className="text-2xl font-semibold text-red-600 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Something went wrong!</p> : " "
      }
      {
        listing && (
          <React.Fragment>
            <Swiper
              spaceBetween={0}
              centeredSlides={true}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: true
              }}
            >
              {
                listing.imageUrls.map((url, index) => {
                  return (
                    <SwiperSlide key={index} >
                      <img 
                        src={url}
                        alt="loading" 
                        className="h-[500px] w-full object-cover"
                      />
                    </SwiperSlide>
                  );
                })
              }
            </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full border-black-300 w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
            }}
            >
              <FaShare
                className='text-blue-700'
              />
            </div>
            {copied && (
              <p className='fixed top-[22%] right-[1%] z-10 rounded-md bg-slate-100 p-2 font-semibold'>
                Link copied!
              </p>
            )}
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
              <p className="text-2xl font-semibold">
                {listing.name} - ${" "}
                {
                  listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')
                }
                {listing.type === "rent" && " / month"}
              </p>

              <p className='flex items-center mt-3 gap-2 text-slate-700 font-semibold text-sm'>
                <FaMapMarkerAlt className='text-green-700' />
                {listing.address}
              </p>

              <div className='flex gap-4'>
                <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md font-semibold'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md font-semibold'>
                    ${+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>

              <p className='text-slate-800'>
                <span className='font-semibold text-black'>Description - </span>
                {listing.description}
              </p>

              <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <FaBed className='text-lg' />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds `
                    : `${listing.bedrooms} bed `}
                </li>
                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <FaBath className='text-lg' />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths `
                    : `${listing.bathrooms} bath `}
                </li>
                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <FaParking className='text-lg' />
                  {listing.parking ? 'Parking spot' : 'No Parking'}
                </li>
                <li className='flex items-center gap-1 whitespace-nowrap '>
                  <FaChair className='text-lg' />
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
              </ul>
              {
                currentUser && currentUser._id !== listing.userRef &&!contact && (
                  <button 
                    className="font-semibold text-white p-3 bg-slate-700 rounded-lg uppercase tracking-wider hover:opacity-85"
                    onClick={() => setContact(true)}
                  > 
                    Contact Landlord
                  </button>
                )
              }
              {
                contact && <Contact listing={listing} />
              }
            </div>
          </React.Fragment>
        )
      }
    </main>
  );
}