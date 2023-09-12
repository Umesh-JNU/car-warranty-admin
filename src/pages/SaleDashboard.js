import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Store } from "../states/store";
// icons
import { BiSolidShieldX } from "react-icons/bi";
import { HiShieldCheck } from "react-icons/hi";
import { BsShieldFillPlus } from "react-icons/bs";
import { FaArrowCircleRight } from "react-icons/fa";
import { IoIosPerson, IoIosPersonAdd, IoMdPie } from "react-icons/io";

import Chart from "react-google-charts";
import Skeleton from "react-loading-skeleton";
import axiosInstance from "../utils/axiosUtil";
import { getError } from "../utils/error";
import { MotionDiv, MessageBox } from "../components";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SaleDashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { token } = state;
  const [time, setTime] = useState("month");


  useEffect(() => {
    console.log({ time });
    (async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axiosInstance.get(
          `/api/sale-person/statistics`,
          {
            headers: { Authorization: token },
          }
        );
        console.log({ data })
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    })();
  }, [token, time]);

  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row
            className="my-3 pb-2"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
          >
            <Col md={6}>
              <h3>Dashboard</h3>
            </Col>
            <Col md={6}>
              {/* <div className="float-md-end d-flex align-items-center">
                <p className="p-bold m-0 me-3">Statistics For</p>
                <Form.Group controlId="time">
                  <Form.Select
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                    }}
                    aria-label="Default select example"
                  >
                    <option key="blankChoice" hidden value>
                      Select Time
                    </option>
                    <option value="all">All Time Statistics</option>
                    <option value="daily">Daily Statistics</option>
                    <option value="weekly">Weekly Statistics</option>
                    <option value="monthly">Monthly Statistics</option>
                  </Form.Select>
                </Form.Group>
              </div> */}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={4} sm={6}>
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>
                      {summary.awaited && summary.awaited[0]
                        ? summary.awaited[0].total
                        : 0}
                    </h3>
                    <p>Awaited Warranties</p>
                  </div>
                  <div className="icon">
                    <BsShieldFillPlus />
                  </div>
                  <Link to="/sale-person/tasks" className="small-box-footer">
                    More info {<FaArrowCircleRight />}
                  </Link>
                </div>
              )}
            </Col>
            <Col lg={4} sm={6}>
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>
                      {summary.rejected && summary.rejected[0]
                        ? summary.rejected[0].total
                        : 0}
                      <sup style={{ fontSize: 20 }}></sup>
                    </h3>
                    <p>Rejected Warranties</p>
                  </div>
                  <div className="icon">
                    <BiSolidShieldX />
                  </div>
                  <Link to="/sale-person/tasks" className="small-box-footer">
                    More info {<FaArrowCircleRight />}
                  </Link>
                </div>
              )}
            </Col>
            <Col lg={4} sm={6}>
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>
                      {summary.passed && summary.passed[0]
                        ? summary.passed[0].total
                        : 0}
                    </h3>
                    <p>Passed Warranties</p>
                  </div>
                  <div className="icon">
                    <HiShieldCheck />
                  </div>
                  <Link to="/sale-person/tasks" className="small-box-footer">
                    More info {<FaArrowCircleRight />}
                  </Link>
                </div>
              )}
            </Col>
          </Row>

          <ToastContainer />
        </>
      )}
    </MotionDiv >
  );
}
