import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem(props) {
  return (
    <div className="bg-white rounded-md shadow-md hover:shadow-lg transition-shadow overflow-hidden w-full sm:w-[340px] flex-grow-[1]">
      <Link to={`/listing/${props.listing._id}`}>
        <img 
          src={props.listing.imageUrls[0]} 
          alt="     loading" 
          className="h-[240px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 mt-3">
          <p className="truncate text-lg font-semibold text-slate-700">{props.listing.name}</p>

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700"/>
            <p className=" text-sm truncate text-gray-600 w-full">{props.listing.address}</p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{props.listing.description}</p>

          <p 
            className="font-semibold text-slate-500 mt-2"
          >
            ${ props.listing.offer ? props.listing.discountPrice.toLocaleString('en-US') : props.listing.regularPrice.toLocaleString('en-US') }
            { props.listing.type == "rent" && "/month"}
          </p>  

          <div className="text-slate-700 flex flex-wrap gap-3" >
            <div className="font-bold text-xs">{ props.listing.bedrooms > 1 ? `${props.listing.bedrooms} Beds` : `${props.listing.bedrooms} bed`}</div>
            <div className="font-bold text-xs">{ props.listing.bathrooms > 1 ? `${props.listing.bathrooms} Baths` : `${props.listing.bathrooms} bath`}</div>
          </div>
        </div>
      </Link>

      {
        props.children && (
          <div className="flex gap-4 font-semibold p-3"> 
            {props.children}
          </div>
        )
      }
    </div>
  );
}