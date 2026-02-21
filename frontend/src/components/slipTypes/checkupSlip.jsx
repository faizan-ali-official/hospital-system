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

const slipFieldClass =
  "input w-full h-10 py-0 px-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#004aa3] focus:ring-2 focus:ring-[#004aa3]/20";

function CheckupSlip() {
  const componentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { doctors, feesTypes, discounts, allSlips, setAllSlips } =
    useMainContext();
  const [generatedSlip, setGeneratedSlip] = useState(null);

  const printFn = useReactToPrint({
    documentTitle: `Patient Slip ${generatedSlip?.id}`,
    contentRef: componentRef,
    copyStyles: true,
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0;
      }
      @media print {
        html {
          width: 80mm !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body {
          width: 80mm !important;
          max-width: 80mm !important;
          margin: 0 !important;
          padding: 3mm !important;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }
        * {
          box-sizing: border-box !important;
          max-width: 100% !important;
        }
        .no-print {
          display: none !important;
        }
        /* Ensure tables and content fit */
        table {
          width: 100% !important;
          table-layout: fixed !important;
          border-collapse: collapse !important;
        }
        td, th {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          padding: 1mm !important;
        }
        /* Prevent text overflow */
        p, div, span {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      }
    `
  });

  const onSubmitHandler = async (values, helpers) => {
    const payload = { ...values, age: Number(values.age) };
    if (!payload.reference_token_no) {
      delete payload.reference_token_no;
    }
    if (!payload.discount_id) {
      delete payload.discount_id;
    }
    let data;
    try {
      setLoading(true);
      if (navigator.onLine) {
        data = await axiosClient.post("/api/patient-slips/", payload);
        allSlips.push({
          ...data?.data?.data
        });
        helpers.resetForm();
        setAllSlips(allSlips);
        setGeneratedSlip(data?.data?.data);
        toast.success("Slip generated successfully!");
      } else {
        saveDataOffline(newData);
      }
      setTimeout(() => {
        printFn();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    patient_name: "",
    doctor_id: "",
    fees_id: "",
    reference_token_no: "",
    slip_type_id: 1,
    age: "",
    gender: "",
    // is_card_holder: false,
    discount_id: ""
  };

  const validationSchema = yup.object({
    patient_name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    doctor_id: yup.string().required("Doctor is required"),
    fees_id: yup.string().required("Fees is required"),
    age: yup.number().required("Age is required"),
    gender: yup
      .string()
      .required("Gender is required")
      .oneOf(["Male", "Female"], "Invalid gender")
  });
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 p-0">
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
                    className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((item) => (
                      <option key={item?.id} value={item?.id}>{`Dr. ${item?.doctor_name}`}</option>
                    ))}
                  </select>
                )}
              </Field>
              <ErrorMessage name="doctor_id" className="text-red-500 text-xs mt-0.5" component="p" />
            </div>
            <div>
              <Input placeholder="Age" name="age" errorName="age" showLabel={false} compact className="h-10 py-0 px-3" />
            </div>
            <div>
              <Field name="gender">
                {({ field }) => (
                  <select
                    {...field}
                    className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                )}
              </Field>
              <ErrorMessage name="gender" className="text-red-500 text-xs mt-0.5" component="p" />
            </div>
            <div>
              <Field name="fees_id">
                {({ field }) => (
                  <select
                    {...field}
                    className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                  >
                    <option value="">Slip Type</option>
                    {feesTypes.map((item) => (
                      <option key={item?.id} value={item?.id}>{item?.doctor_fee}</option>
                    ))}
                  </select>
                )}
              </Field>
              <ErrorMessage name="fees_id" className="text-red-500 text-xs mt-0.5" component="p" />
            </div>
            <div>
              <Field name="discount_id">
                {({ field }) => (
                  <select
                    {...field}
                    className={`${slipFieldClass} ${field.value ? "text-slate-800" : "text-slate-400"}`}
                  >
                    <option value="">No Discount</option>
                    {discounts?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.discount_name} ({item.discount_percentage}%)
                      </option>
                    ))}
                  </select>
                )}
              </Field>
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
        <>
          <div className=" absolute left-[-9999px]">
            <PrintSlip ref={componentRef} user={generatedSlip} />
          </div>
        </>
      )}
    </div>
  );
}

export default CheckupSlip;
