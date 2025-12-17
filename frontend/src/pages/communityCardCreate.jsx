import { useState, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FaFilter, FaTimes } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import CustomAuthButton from "../components/customButton";
import Input from "../components/input/input";
import { axiosClient } from "../utils/AxiosClient";
import { useMainContext } from "../context/mainContext";
import { useLocation } from "react-router-dom";

function CommunityCardCreate() {
  const { state } = useLocation();
  const editData = state?.data;
  const isEdit = Boolean(editData?.id);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [parentQuery, setParentQuery] = useState("");
  const [parentResults, setParentResults] = useState([]);
  const [parentLoading, setParentLoading] = useState(false);
  const { communityCard, setCommunityCard } = useMainContext();
  const Icon = showFilter ? FaTimes : FaFilter;

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const initialValues = {
    full_name: editData?.full_name || "",
    parent_id: editData?.parent_id || "",
    guardian_name: editData?.guardian_name || "",
    cnic: editData?.cnic || "",
    current_address: editData?.current_address || "",
    permanent_address: editData?.permanent_address || "",
    contact_number: editData?.contact_number || "",
    education: editData?.education || "",
    occupation: editData?.occupation || "",
    blood_group: editData?.blood_group || "",
    family_members_count: editData?.family_members_count || "",
    card_number: editData?.card_number || "",
    date_of_birth: formatDateForInput(editData?.date_of_birth),
    gender: editData?.gender || "",
    cast: editData?.cast || "",
    relations:
      editData?.relations?.map((rel) => ({
        ...rel,
        date_of_birth: formatDateForInput(rel.date_of_birth)
      })) || []
  };

  const validationSchema = yup.object({
    full_name: yup
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .required("Full name is required"),
    parent_id: yup.string().nullable(),
    guardian_name: yup.string().trim(),
    cnic: yup
      .string()
      .matches(
        /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
        "CNIC format must be 12345-1234567-1"
      )
      .required("CNIC is required"),
    current_address: yup.string().required("Current address is required"),
    permanent_address: yup.string().required("Permanent address is required"),
    contact_number: yup
      .string()
      .matches(/^03[0-9]{9}$/, "Contact number must be like 03XXXXXXXXX")
      .required("Contact number is required"),
    occupation: yup.string().required("Occupation is required"),
    blood_group: yup
      .string()
      .oneOf(
        ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        "Invalid blood group"
      )
      .required("Blood group is required"),
    family_members_count: yup
      .number()
      .typeError("Family members must be a number"),
    card_number: yup.string().required("Card number is required"),
    date_of_birth: yup.string(),
    gender: yup
      .string()
      .oneOf(["male", "female", "Other"])
      .required("Gender is required"),
    cast: yup.string().nullable(),
    relations: yup.array().of(
      yup.object({
        full_name: yup.string().required("Name is required"),
        relation: yup.string().required("Relation is required"),
        date_of_birth: yup.string(),
        cnic: yup
          .string()
          .matches(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/, "Invalid CNIC")
          .required("CNIC is required")
      })
    )
  });

  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
      const payload = { ...values };
      if (!payload.parent_id) delete payload.parent_id;
      if (!payload.family_members_count) delete payload.family_members_count;
      let res;
      if (isEdit) {
        res = await axiosClient.put(
          `/api/community-cards/${editData.id}`,
          payload
        );
        setCommunityCard((prev) =>
          prev.map((item) => (item.id === editData.id ? res.data : item))
        );
        toast.success("Card updated successfully!");
      } else {
        res = await axiosClient.post("/api/community-cards/", payload);
        setCommunityCard([...communityCard, res.data]);
        toast.success("Card generated successfully!");
      }
      helpers.resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchParent = useCallback(async (cnic) => {
    if (!cnic) return;
    try {
      setParentLoading(true);
      const res = await axiosClient.get("/api/community-cards/search/by-cnic", {
        params: { cnic }
      });
      setParentResults(res.data || []);
    } catch (err) {
      console.error("CNIC search error:", err);
      setParentResults([]);
    } finally {
      setParentLoading(false);
    }
  }, []);

  return (
    <div className="h-[82.5vh] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Community Card</h2>
        <Icon
          size={25}
          className="text-[#004aa3] cursor-pointer"
          onClick={() => setShowFilter(!showFilter)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
        >
          <Form className="px-10 py-10 lg:mx-10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="full_name"
                placeholder="Full Name"
                errorName="full_name"
              />
              <Input
                name="date_of_birth"
                type="date"
                label="Date of Birth"
                errorName="date_of_birth"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Field name="gender">
                  {({ field }) => (
                    <select
                      {...field}
                      className={`input w-full py-3 px-3 rounded border outline-none ${
                        field.value ? "text-black" : "text-gray-400"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  )}
                </Field>
                <ErrorMessage
                  name="gender"
                  component="p"
                  className="text-red-500"
                />
              </div>
              <div>
                <Field name="blood_group">
                  {({ field }) => (
                    <select
                      {...field}
                      className={`input w-full py-3 px-3 rounded border outline-none ${
                        field.value ? "text-black" : "text-gray-400"
                      }`}
                    >
                      <option value="">Select Blood Group</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        )
                      )}
                    </select>
                  )}
                </Field>
                <ErrorMessage
                  name="blood_group"
                  component="p"
                  className="text-red-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Field name="parent_id">
                  {({ form }) => (
                    <>
                      <input
                        type="text"
                        placeholder="Search Parent Community Card"
                        value={parentQuery}
                        onChange={(e) => {
                          const val = e.target.value;
                          setParentQuery(val);
                          if (val.length >= 4) searchParent(val);
                          else setParentResults([]);
                        }}
                        className="input w-full py-3 px-3 rounded border outline-none"
                      />

                      {parentResults.length > 0 && (
                        <ul className="absolute z-10 bg-white border w-full rounded shadow max-h-48 overflow-auto">
                          {parentResults.map((item) => (
                            <li
                              key={item._id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                form.setFieldValue("parent_id", item._id);
                                setParentQuery(
                                  `${item.full_name} (${item.card_number})`
                                );
                                setParentResults([]);
                              }}
                            >
                              <p className="font-medium">{item.full_name}</p>
                              <p className="text-xs text-gray-500">
                                Card: {item.card_number}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </Field>
              </div>
              <Input
                name="guardian_name"
                placeholder="Guardian Name"
                errorName="guardian_name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="cnic" placeholder="CNIC" errorName="cnic" />
              <Input
                name="contact_number"
                placeholder="Contact Number"
                errorName="contact_number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="permanent_address"
                placeholder="Permanent Address"
                errorName="permanent_address"
              />
              <Input
                name="current_address"
                placeholder="Current Address"
                errorName="current_address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="occupation"
                placeholder="Occupation"
                errorName="occupation"
              />
              <Input
                name="family_members_count"
                placeholder="Family Members"
                errorName="family_members_count"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="card_number"
                placeholder="Card Number"
                errorName="card_number"
              />
              <Input name="cast" placeholder="Cast (optional)" />
            </div>
            <FieldArray name="relations">
              {({ push, remove, form }) => (
                <>
                  {form.values.relations.map((_, index) => (
                    <div
                      key={index}
                      className="mt-4 border rounded p-4 relative"
                    >
                      <p className="font-semibold mb-2">
                        Relation # {index + 1}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          name={`relations[${index}].full_name`}
                          placeholder="Name"
                          errorName={`relations[${index}].full_name`}
                        />
                        <Input
                          name={`relations[${index}].relation`}
                          placeholder="Relation"
                          errorName={`relations[${index}].relation`}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <Input
                          type="date"
                          name={`relations[${index}].date_of_birth`}
                          label="Date of Birth"
                        />
                        <Input
                          name={`relations[${index}].cnic`}
                          placeholder="CNIC"
                          errorName={`relations[${index}].cnic`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2 text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <p
                    className="text-blue-500 font-bold border-2 w-[115px] p-2 rounded cursor-pointer"
                    onClick={() =>
                      push({
                        full_name: "",
                        relation: "",
                        date_of_birth: "",
                        cnic: "",
                        parent_cnic: form.values.cnic || ""
                      })
                    }
                  >
                    Add more
                    <CiCirclePlus className="inline ml-1 text-blue-500" />
                  </p>
                </>
              )}
            </FieldArray>
            <div className="mt-10 flex justify-center">
              <CustomAuthButton
                isLoading={loading}
                text="Generate"
                type="submit"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default CommunityCardCreate;
