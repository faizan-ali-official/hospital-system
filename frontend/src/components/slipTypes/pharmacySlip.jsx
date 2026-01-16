// import { useRef, useState } from "react";
// import { useReactToPrint } from "react-to-print";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as yup from "yup";
// import { toast } from "react-toastify";
// import CustomAuthButton from "../customButton";
// import { axiosClient } from "../../utils/AxiosClient";
// import { useMainContext } from "../../context/mainContext";
// import PrintSlip from "../slips/printSlips";
// import Input from "../input/input";
// import Select from "react-select";
// import { customStyles } from "../../styles/customStyle";

// function PharmacySlip() {
//   const componentRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const { doctors, services, allSlips, setAllSlips } = useMainContext();
//   const [generatedSlip, setGeneratedSlip] = useState(null);

//   const printFn = useReactToPrint({
//     documentTitle: `Patient Slip ${generatedSlip?.id}`,
//     contentRef: componentRef,
//     copyStyles: true,
//     pageStyle: `
//       @page {
//         size: 80mm auto;
//         margin: 0;
//       }
//       @media print {
//         html {
//           width: 80mm !important;
//           margin: 0 !important;
//           padding: 0 !important;
//         }
//         body {
//           width: 80mm !important;
//           max-width: 80mm !important;
//           margin: 0 !important;
//           padding: 3mm !important;
//           font-family: 'Courier New', monospace;
//           font-size: 10px;
//           -webkit-print-color-adjust: exact !important;
//           print-color-adjust: exact !important;
//           box-sizing: border-box !important;
//         }
//         * {
//           box-sizing: border-box !important;
//           max-width: 100% !important;
//         }
//         .no-print {
//           display: none !important;
//         }
//         /* Ensure tables and content fit */
//         table {
//           width: 100% !important;
//           table-layout: fixed !important;
//           border-collapse: collapse !important;
//         }
//         td, th {
//           word-wrap: break-word !important;
//           overflow-wrap: break-word !important;
//           padding: 1mm !important;
//         }
//         /* Prevent text overflow */
//         p, div, span {
//           word-wrap: break-word !important;
//           overflow-wrap: break-word !important;
//         }
//       }
//     `
//   });

//   const onSubmitHandler = async (values, helpers) => {
//     const payload = { ...values };
//     if (!payload.notes) {
//       delete payload.notes;
//     }
//     try {
//       setLoading(true);
//       const data = await axiosClient.post("/api/patient-slips/", payload);
//       allSlips.push({
//         ...data?.data?.data
//       });
//       helpers.resetForm();
//       setAllSlips(allSlips);
//       setGeneratedSlip(data?.data?.data);
//       setTimeout(() => {
//         printFn();
//       }, 1000);
//       toast.success("Slip generated successfully!");
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || error?.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const initialValues = {
//     patient_name: "",
//     doctor_id: "",
//     service_id: [],
//     pharmacy_fees: "",
//     reference_token_no: "",
//     slip_type_id: 2,
//     age: "",
//     gender: "",
//     notes: ""
//   };

//   const validationSchema = yup.object({
//     patient_name: yup
//       .string()
//       .required("Name is required")
//       .min(2, "Name must be at least 2 characters"),
//     doctor_id: yup.string().required("Doctor is required"),
//     service_id: yup
//       .array()
//       .of(yup.string())
//       .min(1, "Please select at least one service")
//       .required("Service is required"),
//     pharmacy_fees: yup
//       .number()
//       .typeError("Fees must be a number")
//       .required("Fees is required"),
//     reference_token_no: yup.string().required("Refrence token is required"),
//     age: yup.number().required("Age is required"),
//     gender: yup
//       .string()
//       .required("Gender is required")
//       .oneOf(["Male", "Female"], "Invalid gender"),
//     notes: yup.string()
//   });

//   return (
//     <div>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmitHandler}
//       >
//         <Form className="px-10 py-10  lg:mx-10 ">
//           <Input
//             placeholder="Patient Name"
//             name="patient_name"
//             errorName="patient_name"
//           />
//           <div className="mb-3">
//             <Field name="doctor_id">
//               {({ field, form }) => (
//                 <select
//                   {...field}
//                   className={`input w-full py-3 px-3 rounded border outline-none ${
//                     field.value ? "text-black" : "text-gray-400"
//                   }`}
//                 >
//                   <option value="">Select Doctor</option>
//                   {doctors.map((item) => {
//                     return (
//                       <option
//                         value={item?.id}
//                       >{`Dr. ${item?.doctor_name}`}</option>
//                     );
//                   })}
//                 </select>
//               )}
//             </Field>
//             <ErrorMessage
//               name="doctor_id"
//               className="text-red-500"
//               component="p"
//             />
//           </div>
//           <Input placeholder="Age" name="age" errorName="age" />
//           <div className="mb-3">
//             <Field name="gender">
//               {({ field, form }) => (
//                 <select
//                   {...field}
//                   className={`input w-full py-3 px-3 rounded border outline-none ${
//                     field.value ? "text-black" : "text-gray-400"
//                   }`}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//               )}
//             </Field>
//             <ErrorMessage
//               name="gender"
//               className="text-red-500"
//               component="p"
//             />
//           </div>
//           <div className="mb-3">
//             <Field name="service_id">
//               {({ field, form }) => {
//                 const options = services.map((item) => ({
//                   value: item.id,
//                   label: `${item.service_name} (Rs.${item.service_fees})`
//                 }));
//                 return (
//                   <Select
//                     isMulti
//                     options={options}
//                     value={options.filter((opt) =>
//                       field.value?.includes(opt.value)
//                     )}
//                     placeholder="Select Service"
//                     onChange={(selected) =>
//                       form.setFieldValue(
//                         "service_id",
//                         selected.map((i) => i.value)
//                       )
//                     }
//                     styles={customStyles}
//                     className={`input w-full py-1 px-3 rounded border outline-none ${
//                       field.value?.length ? "text-black" : "text-gray-400"
//                     }`}
//                   />
//                 );
//               }}
//             </Field>
//           </div>
//           <Input
//             placeholder="Pharmacy fees"
//             name="pharmacy_fees"
//             errorName="pharmacy_fees"
//           />
//           <Input
//             placeholder="Reference No"
//             name="reference_token_no"
//             errorName="reference_token_no"
//           />
//           <Input
//             placeholder="Description (optional)"
//             name="notes"
//             errorName="noteso"
//           />
//           <div className=" mt-10 flex justify-center">
//             <CustomAuthButton
//               isLoading={loading}
//               text="Generate"
//               type="submit"
//             />
//           </div>
//         </Form>
//       </Formik>
//       {generatedSlip && (
//         <>
//           <div className=" absolute left-[-9999px]">
//             <PrintSlip ref={componentRef} user={generatedSlip} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default PharmacySlip;

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
import { customStyles } from "../../styles/customStyle";
import BtnLoader from "../loader/btnLoader";

function PharmacySlip() {
  const componentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const { doctors, services, allSlips, setAllSlips } = useMainContext();
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
          <Form className="px-10 py-10 lg:mx-10">
            <div className="flex  justify-end ">
              <Input
                placeholder="Reference No"
                name="reference_token_no"
                errorName="reference_token_no"
              />
              <button
                onClick={() =>
                  fetchByReference(values.reference_token_no, setValues)
                }
                disabled={loader}
                className="bg-[#004aa3] w-[80px] flex text-white py-2 h-12 ml-2 justify-center rounded mt-5 xl:mt-0"
              >
                {loader ? <BtnLoader /> : "Search"}
              </button>
            </div>

            <Input
              placeholder="Patient Name"
              name="patient_name"
              errorName="patient_name"
            />
            <div className="mb-3">
              <Field name="doctor_id">
                {({ field }) => (
                  <select
                    {...field}
                    className={`input w-full py-3 px-3 rounded border outline-none ${
                      field.value ? "text-black" : "text-gray-400"
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
                className="text-red-500"
                component="p"
              />
            </div>

            <Input placeholder="Age" name="age" errorName="age" />
            <div className="mb-3">
              <Field name="gender">
                {({ field }) => (
                  <select
                    {...field}
                    className={`input w-full py-3 px-3 rounded border outline-none ${
                      field.value ? "text-black" : "text-gray-400"
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
                className="text-red-500"
                component="p"
              />
            </div>

            <div className="mb-3">
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
                      styles={customStyles}
                      className={`input w-full py-1 px-3 rounded border outline-none ${
                        field.value?.length ? "text-black" : "text-gray-400"
                      }`}
                    />
                  );
                }}
              </Field>
              <ErrorMessage
                name="service_id"
                className="text-red-500"
                component="p"
              />
            </div>

            <Input
              placeholder="Pharmacy Fees"
              name="pharmacy_fees"
              errorName="pharmacy_fees"
            />

            <Input
              placeholder="Description (optional)"
              name="notes"
              errorName="notes"
            />

            <div className="mt-10 flex justify-center">
              <CustomAuthButton
                isLoading={loading}
                text="Generate"
                type="submit"
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
