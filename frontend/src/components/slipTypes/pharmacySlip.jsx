import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";
import PrintSlip from "../slips/printSlips";
import Input from "../input/input";
import Select from "react-select";
import { getSelectStyles } from "../../styles/customStyle";
import BtnLoader from "../loader/btnLoader";

const slipFieldClass =
  "input w-full h-10 py-0 px-3 rounded-lg border border-slate-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm outline-none focus:border-[#004aa3] dark:focus:border-sky-400 focus:ring-2 focus:ring-[#004aa3]/20 dark:focus:ring-sky-400/20";

function PharmacySlip() {
  const componentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const { doctors, services, allSlips, setAllSlips, theme } = useMainContext();
  const [generatedSlip, setGeneratedSlip] = useState(null);

  const printFn = useReactToPrint({
    documentTitle: `Patient Slip ${generatedSlip?.id}`,
    contentRef: componentRef,
    copyStyles: true,
    pageStyle: `
      @page { size: 80mm auto; margin: 0; }
      @media print {
        html, body { width: 80mm !important; margin: 0 !important; padding: 3mm !important; font-family: 'Courier New', monospace; font-size: 10px; }
        table { width: 100% !important; border-collapse: collapse !important; }
        td, th { word-wrap: break-word !important; padding: 1mm !important; }
        .no-print { display: none !important; }
      }
    `
  });

  const fetchByReference = async (referenceNo, setValues) => {
    if (!referenceNo) return;
    try {
      setLoader(true);
      const res = await axiosClient.get(`/api/patient-slips/${referenceNo}`);
      if (!res?.data) {
        toast.info("No data found for this reference");
        return;
      }
      const d = res.data;
      setValues((prev) => ({
        ...prev,
        patient_name: d.patient_name || "",
        doctor_id: d.doctor_id || "",
        age: d.age || "",
        gender: d.gender || "",
        reference_token_no: d.id || ""
      }));

      setLoader(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid reference number");
      setLoader(false);
    }
  };

  const onSubmitHandler = async (values, helpers) => {
    const payload = { ...values };
    if (!payload.notes) delete payload.notes;
    try {
      setLoading(true);
      const data = await axiosClient.post("/api/patient-slips/", payload);
      allSlips.push({ ...data?.data.data });
      helpers.resetForm();
      setAllSlips(allSlips);
      setGeneratedSlip(data?.data?.data);
      setTimeout(() => printFn(), 1000);
      toast.success("Slip generated successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    patient_name: "",
    doctor_id: "",
    service_id: [],
    pharmacy_fees: "",
    reference_token_no: "",
    slip_type_id: 2,
    age: "",
    gender: "",
    notes: ""
  };

  const validationSchema = yup.object({
    patient_name: yup
      .string()
      .required("Name is required")
      .min(2, "At least 2 chars"),
    doctor_id: yup.string().required("Doctor is required"),
    service_id: yup
      .array()
      .of(yup.string())
      .min(1, "Select at least one service")
      .required(),
    pharmacy_fees: yup
      .number()
      .typeError("Fees must be a number")
      .required("Fees required"),
    reference_token_no: yup.string().required("Reference token required"),
    age: yup.number().required("Age is required"),
    gender: yup
      .string()
      .required("Gender is required")
      .oneOf(["Male", "Female"], "Invalid gender"),
    notes: yup.string()
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        {({ values, setValues, setFieldValue }) => (
          <Form className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 p-0">
            <div className="flex gap-2 sm:col-span-2 items-center">
              <Input
                placeholder="Reference No"
                name="reference_token_no"
                errorName="reference_token_no"
                showLabel={false}
                compact
                className="h-10 py-0 px-3 flex-1"
              />
              <button
                type="button"
                onClick={() =>
                  fetchByReference(values.reference_token_no, setValues)
                }
                disabled={loader}
                className="h-10 rounded-lg bg-[#004aa3] px-4 text-sm font-semibold text-white shadow shrink-0"
              >
                {loader ? <BtnLoader /> : "Search"}
              </button>
            </div>
            <div className="sm:col-span-2">
              <Input
                placeholder="Patient Name"
                name="patient_name"
                errorName="patient_name"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div>
              <Field name="doctor_id">
                {({ field }) => (
                  <select
                    {...field}
                    className={`${slipFieldClass} ${
                      field.value
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >{`Dr. ${item.doctor_name}`}</option>
                    ))}
                  </select>
                )}
              </Field>
              <ErrorMessage
                name="doctor_id"
                className="text-red-500 text-xs mt-0.5"
                component="p"
              />
            </div>
            <div>
              <Input
                placeholder="Age"
                name="age"
                errorName="age"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div className="sm:col-span-2">
              <Field name="gender">
                {({ field }) => (
                  <select
                    {...field}
                    className={`${slipFieldClass} ${
                      field.value
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                )}
              </Field>
              <ErrorMessage
                name="gender"
                className="text-red-500 text-xs mt-0.5"
                component="p"
              />
            </div>
            <div className="sm:col-span-2">
              <Field name="service_id">
                {({ field, form }) => {
                  const options = services.map((item) => ({
                    value: item.id,
                    label: `${item.service_name} (Rs.${item.service_fees})`
                  }));
                  return (
                    <Select
                      isMulti
                      options={options}
                      value={options.filter((opt) =>
                        field.value?.includes(opt.value)
                      )}
                      placeholder="Select Service"
                      onChange={(selected) =>
                        form.setFieldValue(
                          "service_id",
                          selected.map((i) => i.value)
                        )
                      }
                      styles={getSelectStyles(theme === "dark")}
                      classNamePrefix="slip-select"
                    />
                  );
                }}
              </Field>
              <ErrorMessage
                name="service_id"
                className="text-red-500 text-xs mt-0.5"
                component="p"
              />
            </div>
            <div>
              <Input
                placeholder="Pharmacy Fees"
                name="pharmacy_fees"
                errorName="pharmacy_fees"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div>
              <Input
                placeholder="Description (optional)"
                name="notes"
                errorName="notes"
                showLabel={false}
                compact
                className="h-10 py-0 px-3"
              />
            </div>
            <div className="sm:col-span-2 flex justify-center pt-3">
              <CustomAuthButton
                isLoading={loading}
                text="Generate"
                type="submit"
                className="!rounded-xl !py-2.5 !text-sm"
              />
            </div>
          </Form>
        )}
      </Formik>

      {generatedSlip && (
        <div className="absolute left-[-9999px]">
          <PrintSlip ref={componentRef} user={generatedSlip} />
        </div>
      )}
    </div>
  );
}

export default PharmacySlip;
