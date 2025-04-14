import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ListingItem from "../components/ListingItem";


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=6`, {
          method: "GET"
        });
        const data = await res.json();
        if (data.success === false) {
          return console.warn(data.message);
        }
        setOfferListings(data.listings);
        fetchRentListings();
      } catch (error) {
        console.warn(error.message);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=6", {
          method: "GET"
        });
        const data = await res.json();
        if (data.success === false) {
          return console.warn(data.message);
        }
        setRentListings(data.listings);
        fetchSaleListing();
      } catch (error) {
        console.warn(error.message);
      }
    }

    const fetchSaleListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale?limit=6", {
          method: "GET"
        });
        const data = await res.json();
        if (data.success === false) {
          return console.warn(data.message);
        }
        setSaleListings(data.listings);
      } catch (error) {
        console.warn(error.message);
      }
    }


    fetchListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="font-bold text-3xl lg:text-6xl text-slate-700">Find your next <span className="text-slate-500">perfect</span> <br /> place with ease </h1>
        <div className="text-gray-400 text-xs sm:text-sm font-semibold">
          Thirupathi Estate will help you find your home fast, easy and comfortable. <br/>
          Our expert support are always available.
        </div>
        <Link
          to={'/search'}
          className='text-sm sm:text-sm text-blue-800 font-bold'
        >
          Let's get started...
        </Link>
      </div>

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
          offerListings && offerListings.length > 0 && offerListings.map((listing, index) => {
            return (
              <SwiperSlide key={index} >
                <img
                  src={listing.imageUrls[0]}
                  alt="loading"
                  className="h-[500px] w-full object-cover"
                />
              </SwiperSlide>
            );
          })
        }
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings && offerListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                <Link className='text-sm text-blue-800 font-semibold' to={'/search?offer=true'}>Show more offers </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing, index) => {
                    return <ListingItem key={index} listing={listing}></ListingItem>
                  })
                }
              </div>
            </div>
          )
        }

        {
          rentListings && rentListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                <Link className='text-sm text-blue-800 font-semibold' to={'/search?type=rent'}>Show more places for rent</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  rentListings.map((listing, index) => {
                    return <ListingItem key={index} listing={listing}></ListingItem>
                  })
                }
              </div>
            </div>
          )
        }

        {
          saleListings && saleListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                <Link className='text-sm text-blue-800 font-semibold' to={'/search?type=sale'}>Show more places for sale</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  saleListings.map((listing, index) => {
                    return <ListingItem key={index} listing={listing}></ListingItem>
                  })
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}