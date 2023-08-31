import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Formik, FieldArray, Form } from "formik";
import * as Yup from "yup";

import AsyncFormikSelect from "../components/AsyncSelectFormik";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import { getCitiesByKeyword } from "../utils/api";
import Counter from "../components/Counter";

const Home = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialValues, setInitialValues] = useState({
    origin: { name: "", lat: null, lon: null },
    destination: [{ name: "", lat: null, lon: null }],
    passengers: 0,
    date: new Date(),
  });

  console.log(searchParams);
  const navigate = useNavigate();
  const location = useLocation();

  const validationSchema = Yup.object().shape({
    origin: Yup.object().shape({
      name: Yup.string().required("You must choose the city of origin."),
    }),
    destination: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required(
            "You must choose the city of destination."
          ),
        })
      )
      .min(1, "You must choose the city of destination."),
    passengers: Yup.number()
      .required("Select passengers.")
      .moreThan(0, "Select passengers."),
    date: Yup.string()
      .required("Date is required.")
      .test("valid-date-format", "Date is required.", (value) => {
        const parts = value.split("-");
        const isoFormat = `${parts[1]}/${parts[2]}/${parts[0]}`;
        return /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(
          isoFormat
        );
      }),
  });

  const formatResults = (results: any) => {
    return results.map((result: Array<string>) => {
      return {
        name: result[0],
        lat: result[1],
        lon: result[2],
      };
    });
  };

  const searchCity = async (keyword: string) => {
    const matchingCities = await getCitiesByKeyword(keyword);
    return formatResults(matchingCities);
  };

  const generateQueryParams = (values: any) => {
    const queryParams = new URLSearchParams();
    queryParams.set("origin", JSON.stringify(values.origin));
    queryParams.set("destination", JSON.stringify(values.destination));
    queryParams.set("passengers", values.passengers);
    queryParams.set("date", values.date);
    return queryParams.toString();
  };

  const handleSubmit = async (e: any) => {
    const query = generateQueryParams(e);
    navigate(`/results?${query}`);
  };

  function parseQueryString(url: string): Record<string, any> {
    const queryParams = new URLSearchParams(url.split("?")[1]);

    const parsedObject: Record<string, any> = {};

    queryParams.forEach((value, key) => {
      try {
        parsedObject[key] = JSON.parse(value);
      } catch {
        parsedObject[key] = value;
      }
    });
    const mergedObject = { ...initialValues, ...parsedObject };
    return mergedObject;
  }

  useEffect(() => {
    if (location.search) {
      const q = parseQueryString(location.search);
      setInitialValues(q as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="m-5">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, errors, handleChange, handleBlur, setFieldValue }) => (
          <Form className="md:w-1/3">
            <div className="mb-2">
              <AsyncFormikSelect
                loadFunction={searchCity}
                formikFieldName="origin"
                onBlur={(e) => {
                  handleBlur(e);
                  setSearchParams((searchParams) => {
                    searchParams.set("origin", JSON.stringify(values.origin));
                    return searchParams;
                  });
                }}
                onClear={() => setFieldValue("origin", { name: "" })}
                value={values.origin}
                errorMessage={errors && errors.origin?.name}
                label="City of origin"
              />
            </div>
            <FieldArray
              name="destination"
              render={(arrayHelpers: any) => {
                const destination = values.destination;
                return (
                  <div>
                    {destination && destination.length > 0
                      ? destination.map((d: any, index: number) => (
                          <div key={index} className="flex items-center  mb-2">
                            <div className="flex flex-col  w-full  mb-2">
                              <Label labelName="City of destination" />

                              <AsyncFormikSelect
                                loadFunction={searchCity}
                                formikFieldName={`destination.${index}`}
                                onBlur={(e) => {
                                  handleBlur(e);

                                  setSearchParams((searchParams) => {
                                    searchParams.set(
                                      `destination`,
                                      JSON.stringify(values.destination)
                                    );
                                    return searchParams;
                                  });
                                }}
                                onClear={() =>
                                  setFieldValue(`destination.${index}`, {
                                    name: "",
                                  })
                                }
                                value={values.destination[index]}
                                errorMessage={
                                  errors &&
                                  errors.destination &&
                                  errors.destination[index] &&
                                  (errors.destination[index] as any).name
                                }
                              />
                            </div>
                            {destination.length > 1 && (
                              <Button
                                key={`btn-${index}`}
                                name="&times;"
                                onClick={() => arrayHelpers.remove(index)}
                                className="flex items-center justify-center mr-5 border rounded-full w-5 h-5 ml-5"
                              />
                            )}
                          </div>
                        ))
                      : null}
                    <Button
                      className="flex items-center text-xs text-gray-500 mt-2 mb-6"
                      name={
                        <>
                          <div className="flex items-center justify-center mr-5 border rounded-full w-5 h-5">
                            +
                          </div>
                          Add destination
                        </>
                      }
                      onClick={() => arrayHelpers.push({ name: "" })}
                    />
                  </div>
                );
              }}
            />

            <div className="flex justify-between mb-6">
              <div>
                <Counter
                  label={"Passengers"}
                  onClickAdd={() => {
                    setFieldValue("passengers", values.passengers + 1);
                    setSearchParams((searchParams) => {
                      searchParams.set(
                        "passengers",
                        (values.passengers += 1).toString()
                      );
                      return searchParams;
                    });
                  }}
                  onClickRemove={() => {
                    if (values.passengers > 0) {
                      setFieldValue("passengers", values.passengers - 1);
                      setSearchParams((searchParams) => {
                        searchParams.set(
                          "passengers",
                          (values.passengers - 1).toString()
                        );
                        return searchParams;
                      });
                    }
                  }}
                  value={values.passengers}
                  errorMessage={
                    errors && errors.passengers ? errors.passengers : ""
                  }
                />
              </div>
              <div className="max-w-sm w-36">
                <Input
                  label="Date"
                  type="date"
                  name="date"
                  value={values.date.toString()}
                  onChange={(e) => {
                    handleChange(e);
                    handleBlur(e);
                    setSearchParams((searchParams) => {
                      searchParams.set("date", e.target.value);
                      return searchParams;
                    });
                  }}
                  min={new Date().toISOString().slice(0, 10)}
                  errorMessage={
                    errors && errors.date ? (errors.date as string) : ""
                  }
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                name="Submit"
                type="submit"
                className="text-white rounded  w-32 h-8 bg-sky-700 hover:bg-gray-300"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Home;
