import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import "./login.scss";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { fetchSchoolDetails } from "../../services/authService";

import TextInput from "../../components/Input/TextInput";
import { useLogin } from "../../hooks/mutations/auth";
// import CryptoJS from "crypto-js";  // Import crypto-js

type schoolDetails = {
  idx: number;
  subdomain: string;
};
const Login = () => {
  const navigate = useNavigate();

  const [schoolDetails, setSchoolDetails] = useState<schoolDetails[]>([]);

  // //get school details
  // const getSchoolDetails = async () => {
  //   try {
  //     let res = await fetchSchoolDetails();
  //     setSchoolDetails(res.data);
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const { mutate, isLoading } = useLogin();
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const handleChange = (evt: any) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleBlur = (evt: any) => {
    const value = evt.target.value;
    if (!value) {
      setErrors({
        ...errors,
        [evt.target.name]: `Field cannot be empty`,
      });
    } else {
      setErrors({
        ...errors,
        [evt.target.name]: ``,
      });
    }
  };

  let url =
    window.location != window.parent.location
      ? document.referrer.endsWith("/")
        ? document.referrer.replace("https://", "").slice(0, -1)
        : document.referrer.replace("https://", "")
      : "demo.edves.net";

  const location = useLocation();
  const [schId, setSchId] = useState(0);

  const queryParams = new URLSearchParams(location.search);

  const schIdValue = queryParams.get("schId");

  // setSchId(schIdValue);

  //submit form
  const submit = async () => {
    let response = await fetchSchoolDetails();

    // const schoolDataArray = response.data.filter(
    //   (item) => item.arm.idx === parseInt(schIdValue)
    // );
    // const schoolData = schoolDataArray.length > 0 ? schoolDataArray[0] : null;
    // Find the matching school data using filter
    const schoolData = response.data.find(
      (item: any) => item.arm.idx === parseInt(schIdValue)
    );

    //  const encryptPassword = (password: string) => {
    //    const encrypted = CryptoJS.AES.encrypt(
    //      password,
    //      "secret key 123"
    //    ).toString();
    //    return encrypted;
    //  };

    if (schoolData) {
      let dataToSend = {
        name: schoolData?.arm?.name,
        // password: encryptPassword("edves_account_111"),
        password: "edves_account_111",
        idx: schoolData?.idx,
        arm: schIdValue,
        school_url: schoolData?.subdomain,
        address: schoolData?.address ? schoolData?.subdomain : "Nigeria",
        contact: `${
          schoolData?.school_group_name
            ? schoolData.school_group_name.split(" ")[0]
            : "default"
        }@gmail.com`,
        logo: schoolData?.arm?.logo,
      };

      mutate(dataToSend, {
        onSuccess: (res) => {
          localStorage.setItem("userDetails", JSON.stringify(res?.data));
          localStorage.setItem("currency", schoolData?.currency);
          localStorage.setItem("token", res?.data?.tokens?.access);
          window.location.replace("/income-and-expense");
        },
        onError: (e) => {
          console.log(e);
        },
      });
    } else {
      let dataToSend = {
        name: response?.data[0]?.arm?.name,
        password: "edves_account_111",
        idx: response?.data[0]?.idx,
        arm: "1",
        school_url: response?.data[0]?.subdomain,
        address: response?.data[0]?.address
          ? response?.data[0]?.subdomain
          : "Nigeria",
        contact: `${
          response?.data[0]?.school_group_name?.split(" ")[0]
        }@gmail.com`,
        logo: response?.data[0]?.arm?.logo,
      };
      mutate(dataToSend, {
        onSuccess: (res) => {
          //toast.success('Login successful');
          localStorage.setItem("userDetails", JSON.stringify(res?.data));
          localStorage.setItem("currency", response?.data[0]?.currency);
          localStorage.setItem("token", res?.data?.tokens?.access);
          window.location.replace("/income-and-expense");
        },
        onError: (e) => {
          console.log(e);
          //toast.error('Invalid credentials');
        },
      });
      console.log("School ID not found");
    }

    // let dataToSend = {
    //   name: response?.data[0]?.arm?.name,
    //   password: "edves_account_111",
    //   idx: response?.data[0]?.idx,
    //   school_url: response?.data[0]?.subdomain,
    //   address: response?.data[0]?.address
    //     ? response?.data[0]?.subdomain
    //     : "Nigeria",
    //   contact: `${
    //     response?.data[0]?.school_group_name?.split(" ")[0]
    //   }@gmail.com`,
    //   logo: response?.data[0]?.arm?.logo,
    // };

    // mutate(dataToSend, {
    //   onSuccess: (res) => {
    //     //toast.success('Login successful');
    //     localStorage.setItem("userDetails", JSON.stringify(res?.data));
    //     localStorage.setItem("currency", response?.data[0]?.currency);
    //     localStorage.setItem("token", res?.data?.tokens?.access);
    //     window.location.replace("/income-and-expense");
    //   },

    //   onError: (e) => {
    //     console.log(e);
    //     //toast.error('Invalid credentials');
    //   },
    // });
  };

  useEffect(() => {
    submit();
  }, []);

  return <div className="login"></div>;
};

export default Login;
