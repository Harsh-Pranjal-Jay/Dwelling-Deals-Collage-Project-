import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminListingsPage() {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
              const res = await fetch("/api/admin/getposts");
              const data = await res.json();
              setListings(data);
            } catch (error) {
              console.log(error);
            }
          };
      
          fetchListings();
    }, []);

    const handleListingDelete = async (listingId) => {
        try {
          const res = await fetch(`/api/admin/posts/delete/${listingId}`, {
            method: "DELETE",
          });
          const data = await res.json();
    
          if (data.success === false) {
            console.log(data.message);
            return;
          }
    
          // Get all listing except one which has listingId
          setListings((prev) =>
            prev.filter((listing) => listing._id !== listingId)
          );
        } catch (error) {
          console.log(error.message);
        }
      };
      const handleStatusUpdate = async (status, listing) => {
        listing.status = status
        try {
          console.log(listing);
          const res = await fetch(`/api/admin/posts/update/${listing._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...listing,
            }),
          });
          const data = await res.json();
    
          if (data.success === false) {
            console.log("Error" + data.message);
            return;
          }
    
          // Get all listing except one which has listingId
          
          setListings((prev) =>
            prev.filter((listing) => listing.status !== "pending")
          );
        } catch (error) {
          console.log(error.message);
        }
      };

  return (
    <>
        {listings && listings.length > 0 && (
            <div className="px-6">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-700">
                  Listings List
                </h2>
              </div>

              <div className="flex flex-wrap gap-4">
                {
                  <table className="w-full">
                    <thead className="bg-gray-300 border-gray-300">
                      <tr className="">
                        <th className="p-2 text-lg text-blue-600 font-semibold tracking-wide text-left">Id</th>
                        <th className="p-2 text-lg text-blue-600 font-semibold tracking-wide text-left">Name</th>
                        <th className="p-2 text-lg text-blue-600 font-semibold tracking-wide text-left">User Id</th>
                        <th className="p-2 text-lg text-blue-600 font-semibold tracking-wide text-left">Status</th>
                        <th className="p-2 text-lg text-blue-600 font-semibold tracking-wide text-left">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing, index) => (
                        <tr
                          key={listing._id}
                          className={index % 2 == 0 ? "bg-white" : "bg-gray-200"}
                        >
                          <td className="p-2 text-black hover:underline"><Link to={`/posts/${listing._id}`}>{listing._id}</Link></td>
                          <td className="p-2 text-black">{listing.title}</td>
                          <td className="p-2 text-black hover:underline"><Link to={`/users/${listing.userRef}`}>{listing.userRef}</Link></td>
                          <td> {listing.status == "pending" && (
                            <>
                              <button onClick={()=>handleStatusUpdate('Verified',listing)} className='bg-green-500 text-white my-1 mx-1 px-2 py-1 rounded-md text-sm font-normal'>Verify</button>
                              <button onClick={()=>handleStatusUpdate('Rejected',listing)} className='bg-red-500 text-white px-2 py-1 rounded-md text-sm font-normal'>Reject</button>
                            </>
                          )}
                          {listing.status == "Verified" &&(<span className='bg-green-500 text-white px-2 py-2 rounded-md text-sm font-normal'>{listing.status}</span>)}
                          {listing.status == "Rejected" &&(<span className='bg-red-500 text-white px-2 py-2 rounded-md text-sm font-normal'>{listing.status}</span>)}
                          </td>
                          <td className="p-2 text-red-600 cursor-pointer" onClick={() => handleListingDelete(listing._id)}>Delete</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            </div>
          )}
    </>
  )
}
