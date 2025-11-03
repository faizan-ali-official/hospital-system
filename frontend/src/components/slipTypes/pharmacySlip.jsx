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

function PharmacySlip() {
  const componentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { doctors, feesTypes, allSlips, setAllSlips } = useMainContext();
  const [generatedSlip, setGeneratedSlip] = useState(null);

  const printFn = useReactToPrint({
    documentTitle: `Pateint Slip ${generatedSlip?.id}`,
    contentRef: componentRef,
    copyStyles: true,
    pageStyle: `
    @page {
      size: 896px 1454px; 
      margin: 0; 
    }
    @media print {
      body {
        margin: 0;
        -webkit-print-color-adjust: exact;
      }
    }
  `
  });

  const onSubmitHandler = async (values, helpers) => {
    const payload = { ...values };
    if (!payload.notes) {
      delete payload.notes;
    }
    console.log(payload, "payload");
    try {
      setLoading(true);
      const data = await axiosClient.post("/api/patient-slips/", payload);
      allSlips.push({
        ...data?.data?.data
      });
      helpers.resetForm();
      setAllSlips(allSlips);
      setGeneratedSlip(data?.data?.data);
      setTimeout(() => {
        printFn();
      }, 1000);
      toast.success("Slip generated successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };
  const initialValues = {
    patient_name: "",
    doctor_id: "",
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
      .min(2, "Name must be at least 2 characters"),
    doctor_id: yup.string().required("Doctor is required"),
    pharmacy_fees: yup
      .number()
      .typeError("Fees must be a number")
      .required("Fees is required"),
    reference_token_no: yup.string().required("Refrence token is required"),
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
          <Input
            placeholder="Pharmacy fees"
            name="pharmacy_fees"
            errorName="pharmacy_fees"
          />
          <Input
            placeholder="Reference No"
            name="reference_token_no"
            errorName="reference_token_no"
          />
          <Input
            placeholder="Description (optional)"
            name="notes"
            errorName="noteso"
          />
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

export default PharmacySlip;
