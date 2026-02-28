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

const fieldClass =
  "input w-full h-10 py-0 px-3 rounded-lg border border-slate-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-[#004aa3] dark:focus:border-sky-400 focus:ring-2 focus:ring-[#004aa3]/20 dark:focus:ring-sky-400/20";

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
    occupation: yup.string(),
    blood_group: yup
      .string()
      .oneOf(
        ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        "Invalid blood group"
      ),
    family_members_count: yup
      .number()
      .typeError("Family members must be a number"),
    card_number: yup.string(),
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
      setParentResults([]);
    } finally {
      setParentLoading(false);
    }
  }, []);

  return (
    <div className="h-[82.5vh] flex flex-col overflow-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Community Card</h2>
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
          <Form className="px-10 py-10 lg:mx-10 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="full_name"
                placeholder="Full Name"
                errorName="full_name"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
              <Input
                name="date_of_birth"
                type="date"
                errorName="date_of_birth"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Field name="gender">
                  {({ field }) => (
                    <select
                      {...field}
                      className={`${fieldClass} ${field.value ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}
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
                  className="mt-1 text-xs text-red-500"
                />
              </div>
              <div>
                <Field name="blood_group">
                  {({ field }) => (
                    <select
                      {...field}
                      className={`${fieldClass} ${field.value ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}
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
                  className="mt-1 text-xs text-red-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        className={fieldClass}
                      />

                      {parentResults.length > 0 && (
                        <ul className="absolute z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 w-full rounded-lg shadow-lg max-h-48 overflow-auto">
                          {parentResults.map((item) => (
                            <li
                              key={item.id ?? item._id}
                              className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer text-sm"
                              onClick={() => {
                                form.setFieldValue("parent_id", item.id ?? item._id);
                                setParentQuery(
                                  `${item.full_name} (${item.card_number})`
                                );
                                setParentResults([]);
                              }}
                            >
                              <p className="font-medium text-slate-800 dark:text-slate-200">{item.full_name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
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
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input name="cnic" placeholder="CNIC" errorName="cnic" showLabel={false} compact className="h-10 py-0 px-3" />
              <Input
                name="contact_number"
                placeholder="Contact Number"
                errorName="contact_number"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="permanent_address"
                placeholder="Permanent Address"
                errorName="permanent_address"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
              <Input
                name="current_address"
                placeholder="Current Address"
                errorName="current_address"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="occupation"
                placeholder="Occupation"
                errorName="occupation"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
              <Input
                name="family_members_count"
                placeholder="Family Members"
                errorName="family_members_count"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="card_number"
                placeholder="Card Number"
                errorName="card_number"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
              <Input name="cast" placeholder="Cast (optional)" showLabel={false} compact className="h-10 py-0 px-3" />
            </div>
            <FieldArray name="relations">
              {({ push, remove, form }) => (
                <>
                  {form.values.relations.map((_, index) => (
                    <div
                      key={index}
                      className="mt-3 rounded-lg border border-slate-200 dark:border-slate-600 p-4 relative dark:bg-slate-800/50"
                    >
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                        Relation # {index + 1}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          name={`relations[${index}].full_name`}
                          placeholder="Name"
                          errorName={`relations[${index}].full_name`}
                          showLabel={false}
                          compact
                          className="h-10 py-0 px-3"
                        />
                        <Input
                          name={`relations[${index}].relation`}
                          placeholder="Relation"
                          errorName={`relations[${index}].relation`}
                          showLabel={false}
                          compact
                          className="h-10 py-0 px-3"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <Input
                          type="date"
                          name={`relations[${index}].date_of_birth`}
                          showLabel={false}
                          compact
                          className="h-10 py-0 px-3"
                        />
                        <Input
                          name={`relations[${index}].cnic`}
                          placeholder="CNIC"
                          errorName={`relations[${index}].cnic`}
                          showLabel={false}
                          compact
                          className="h-10 py-0 px-3"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-3 right-3 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
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
                    <CiCirclePlus className="w-4 h-4" />
                    Add more
                  </button>
                </>
              )}
            </FieldArray>
            <div className="mt-8 flex justify-center">
              <CustomAuthButton
                isLoading={loading}
                text={isEdit ? "Update Card" : "Generate"}
                type="submit"
                className="!h-10 !rounded-lg !py-0 !text-sm"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default CommunityCardCreate;
