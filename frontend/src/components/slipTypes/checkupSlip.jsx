import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import CustomAuthButton from "../customButton";
import { axiosClient } from "../../utils/AxiosClient";
import { useMainContext } from "../../context/mainContext";
import PrintSlip from "../slips/printSlips";

function CheckupSlip() {
  const componentRef = useRef(null);
  const printFn = useReactToPrint({
    documentTitle: "AwesomeFileName",
    contentRef: componentRef,
    copyStyles: false
  });
  const [loading, setLoading] = useState(false);
  const { doctors, feesTypes, allSlips, setAllSlips } = useMainContext();

  const [generatedSlip, setGeneratedSlip] = useState(null);
  const onSubmitHandler = async (values, helpers) => {
    const payload = { ...values };
    if (!payload.reference_token_no) {
      delete payload.reference_token_no;
    }
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
    fees_id: "",
    reference_token_no: "",
    slip_type_id: 1
  };
  const validationSchema = yup.object({
    patient_name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    doctor_id: yup.string().required("Doctor is required"),
    fees_id: yup.string().required("Fees is required"),
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
          <div className="mb-3">
            <Field
              placeholder="Patient Name"
              type="text"
              name="patient_name"
              className="input w-full py-3 px-3 rounded border outline-none"
            />
            <ErrorMessage
              name="patient_name"
              className="text-red-500"
              component="p"
            />
          </div>
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
          <div className="mb-3">
            <Field
              placeholder="Reference No"
              type="text"
              name="reference_token_no"
              className="input w-full py-3 px-3 rounded border outline-none"
            />
            <ErrorMessage
              name="reference_token_no"
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
