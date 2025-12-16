import React, { useRef, useState, useEffect } from "react";
import DeleteModal from "../components/communityCard/deleteModal";
import { useMainContext } from "../context/mainContext";
import { toast } from "react-toastify";
import { axiosClient } from "../utils/AxiosClient";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CommunityCard = () => {
  const navigate = useNavigate();
  const tableContainerRef = useRef(null);
  const { user, communityCard, setCommunityCard } = useMainContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchCard, setSearchCard] = useState("");
  const [searchedCard, setSearchedCard] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showNo, setShowNo] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const Icon = showFilter ? FaTimes : FaSearch;

  const limit = 100;

  const fetchSlips = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/api/community-cards?limit=${limit}&offset=${offset}&deleted=true`
      );
      const newSlips = response?.data;
      setCommunityCard((prevSlips) => [...prevSlips, ...newSlips]);
      setOffset((prevOffset) => prevOffset + limit);
      if (newSlips.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch more slips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        tableContainerRef.current;
      if (
        scrollHeight - scrollTop <= clientHeight + 50 &&
        !loading &&
        hasMore
      ) {
        fetchSlips();
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore]);

  const onDelete = async () => {
    try {
      await axiosClient.delete(`/api/community-cards/${selectedUser?.id}`);
      const deletedCard = communityCard.filter(
        (user) => user?.id !== selectedUser?.id
      );
      setCommunityCard(deletedCard);
      setSelectedUser(null);
      toast.success("Card deleted successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message);
    }
  };

  const onSearch = async () => {
    try {
      const res = await axiosClient.get("/api/community-cards/", {
        params: { search: searchCard }
      });
      setSearchedCard(res.data || []);
      console.log(res);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <div className="flex justify-center h-[calc(89vh - 33px)] ">
      <div className="w-full xl:w-[90%] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Community Card</h2>
          <div className="flex items-center">
            <Icon
              size={25}
              onClick={() => setShowFilter(!showFilter)}
              className="text-[#004aa3] cursor-pointer"
            />
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/communitycardcreate")}
                className="bg-[#004aa3] text-white px-4 py-2 ml-3 rounded shadow cursor-pointer"
              >
                + Card
              </button>
            )}
          </div>
        </div>
        <div className="flex border-b-1 pb-4 mb-2 border-b-[#004aa3]">
          <input
            type="text"
            placeholder="Search by CNIC"
            value={searchCard}
            onChange={(e) => setSearchCard(e.target.value)}
            className="border w-full p-2 mt-4 rounded"
          />
          <button
            onClick={() => onSearch()}
            className="bg-[#004aa3] text-white px-4 rounded shadow mt-4 ml-5 cursor-pointer"
          >
            Search
          </button>
        </div>
        <div
          ref={tableContainerRef}
          className={`overflow-y-auto ${
            showFilter ? "max-h-[calc(89vh-350px)]" : "max-h-[calc(89vh-80px)]"
          } mt-4`}
        >
          {!showNo ? (
            communityCard ? (
              <table className="w-full rounded">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-left text-sm uppercase text-gray-600">
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Card ID
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3]">Name</th>
                    <th className="py-3 px-6 border border-[#004aa3]">CNIC</th>
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Card No
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3]">
                      Contact Number
                    </th>
                    <th className="py-3 px-6 border border-[#004aa3] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {communityCard
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((item) => (
                      <tr key={item.id} className="text-sm hover:bg-gray-50">
                        <td className="py-3 px-6 border border-[#004aa3]">
                          {item?.id}
                        </td>
                        <td className="py-3 px-6 border border-[#004aa3] capitalize">
                          {item?.full_name}
                        </td>
                        <td className="py-3 px-6 border border-[#004aa3] capitalize">
                          {item?.cnic}
                        </td>
                        <td className="py-3 px-6 border border-[#004aa3] capitalize">
                          {item?.card_number}
                        </td>
                        <td className="py-3 px-6 border border-[#004aa3] capitalize">
                          {item?.contact_number}
                        </td>
                        <td className="py-3 px-6 border border-[#004aa3] text-center">
                          {user?.role === "admin" && (
                            <>
                              <button
                                onClick={() => {
                                  navigate("/communitycardcreate", {
                                    state: { data: item }
                                  });
                                }}
                                className="bg-[#004aa3] text-white px-3 py-1 rounded mr-1 mt-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(item);
                                  setShowModal(true);
                                }}
                                className="bg-[#004aa3] text-white px-3 py-1 rounded mr-1 mt-1"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="min-h-[400px] flex items-center justify-center text-gray-500 text-lg">
                No data found
              </div>
            )
          ) : (
            <div className="h-[40vh] flex items-center justify-center">
              <p className="text-center font-bold text-xl text-[#004aa3]">
                No Data Found
              </p>
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center text-[#004aa3] py-4 font-bold">
              Loading more data...
            </div>
          )}
          {!hasMore && (
            <div className="flex justify-center items-center py-4 text-[#004aa3] font-bold">
              End of records.
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <DeleteModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete ?`}
          onCancel={() => {
            setSelectedUser(null);
            setShowModal(false);
          }}
          onConfirm={() => {
            onDelete();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CommunityCard;
