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

function CheckupSlip() {
  const componentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { doctors, feesTypes, allSlips, setAllSlips } = useMainContext();
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
    gender: ""
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
      .oneOf(["Male", "Female"], "Invalid gender"),
    reference_token_no: yup.string().when("fees_id", {
      is: "3",
      then: (schema) =>
        schema
          .required("Reference No is required")
          .min(2, "Reference No must be at least 2 characters"),
      otherwise: (schema) => schema.notRequired()
    })
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
      >
        <Form className="px-10 py-10  lg:mx-10 ">
          <Input
            placeholder="Patient Name"
            name="patient_name"
            errorName="patient_name"
          />
          <div className="mb-3">
            <Field name="doctor_id">
              {({ field, form }) => (
                <select
                  {...field}
                  className={`input w-full py-3 px-3 rounded border outline-none ${
                    field.value ? "text-black" : "text-gray-400"
                  }`}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((item) => {
                    return (
                      <option
                        value={item?.id}
                      >{`Dr. ${item?.doctor_name}`}</option>
                    );
                  })}
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
              {({ field, form }) => (
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
            <Field name="fees_id">
              {({ field, form }) => (
                <select
                  {...field}
                  className={`input w-full py-3 px-3 rounded border outline-none ${
                    field.value ? "text-black" : "text-gray-400"
                  }`}
                >
                  <option value="">Slip Type</option>
                  {feesTypes.map((item) => {
                    return (
                      <option value={item?.id}>{`${item?.doctor_fee}`}</option>
                    );
                  })}
                </select>
              )}
            </Field>
            <ErrorMessage
              name="fees_id"
              className="text-red-500"
              component="p"
            />
          </div>
          <div className=" mt-10 flex justify-center">
            <CustomAuthButton
              isLoading={loading}
              text="Generate"
              type="submit"
            />
          </div>
        </Form>
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
