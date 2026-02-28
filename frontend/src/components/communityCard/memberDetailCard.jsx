import React from "react";
import { HiXMark } from "react-icons/hi2";

const DetailRow = ({ label, value }) => (
  <p className="text-sm text-slate-800 dark:text-slate-200">
    <span className="font-medium text-slate-600 dark:text-slate-400">{label}:</span>{" "}
    {value ?? "N/A"}
  </p>
);

const MemberDetailModal = ({ data, onClose }) => {
  if (!data) return null;
  const formatDate = (d) =>
    d ? new Date(d).toISOString().split("T")[0].split("-").reverse().join("-") : "";
  const calculateAge = (d) => {
    if (!d) return null;
    const dob = new Date(d);
    const t = new Date();
    let a = t.getFullYear() - dob.getFullYear();
    return t < new Date(t.getFullYear(), dob.getMonth(), dob.getDate())
      ? a - 1
      : a;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl">
        {/* Header - same as edit slip modal */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-600 px-6 py-4 sticky top-0 bg-white dark:bg-slate-800 z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Community Card Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Main Member */}
          <section className="mb-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Main Member
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              <DetailRow label="Name" value={data.full_name} />
              <DetailRow label="CNIC" value={data.cnic} />
              <DetailRow label="Guardian" value={data.guardian_name} />
              <DetailRow label="Contact" value={data.contact_number} />
              <DetailRow label="Card No" value={data.card_number} />
              <DetailRow label="Address" value={data.current_address} />
              <DetailRow label="DOB" value={formatDate(data.date_of_birth)} />
              <DetailRow label="Age" value={calculateAge(data.date_of_birth)} />
            </div>
          </section>

          {/* Family Members */}
          <section>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Family Members
            </h3>
            {data.relations?.length ? (
              <div className="space-y-3">
                {data.relations.map((rel, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 px-4 py-3 text-sm"
                  >
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                      <DetailRow label="Name" value={rel.full_name} />
                      <DetailRow label="Relation" value={rel.relation} />
                      <DetailRow label="CNIC" value={rel.cnic} />
                      <DetailRow label="DOB" value={formatDate(rel.date_of_birth)} />
                      <DetailRow
                        label="Age"
                        value={
                          calculateAge(rel.date_of_birth) != null
                            ? `${calculateAge(rel.date_of_birth)} years`
                            : null
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No relations found</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
