import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Store } from "../states/store";
// icons
import { BiSolidShieldX } from "react-icons/bi";
import { HiShieldCheck, HiShieldExclamation } from "react-icons/hi";
import { GiNetworkBars } from "react-icons/gi";
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

export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { token } = state;
  const [time, setTime] = useState("month");

  const monthlySales = (data) => {
    const months = [
      ['Jan', 0],
      ['Feb', 0],
      ['Mar', 0],
      ['Apr', 0],
      ['May', 0],
      ['Jun', 0],
      ['Jul', 0],
      ['Aug', 0],
      ['Sept', 0],
      ['Oct', 0],
      ['Nov', 0],
      ['Dec', 0],
    ];

    data.forEach((x) => {
      console.log({ x });
      if (x.month) months[x.month - 1][1] = x.totalSales;
    });
    console.log({ months });
    return months;
  };

  useEffect(() => {
    console.log({ time });
    (async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axiosInstance.get(
          `/api/admin/statistics/${time}`,
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

          <Row className="m-0 mb-3">
            <Col lg={3} md={4} sm={5} xs={12}>
              <div>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>
                        {summary.users && summary.users[0]
                          ? summary.users[0].total
                          : 0}
                      </h3>
                      <p>Users</p>
                    </div>
                    <div className="icon">
                      <IoIosPersonAdd />
                    </div>
                    <Link to="/admin/users" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </div>
              <div>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>
                        {summary.pending && summary.pending[0]
                          ? summary.pending[0].total
                          : 0}
                      </h3>
                      <p>Pending Warranties</p>
                    </div>
                    <div className="icon">
                      <HiShieldExclamation />
                    </div>
                    <Link to="/admin/warranty" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </div>
              <div>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-success">
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
                    <Link to="/admin/warranty" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </div>
              <div>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-danger">
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
                    <Link to="/admin/warranty" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </div>
            </Col>
            <Col lg={9} md={8} sm={7} xs={12}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">
                  Sales Report
                </Card.Header>
                <Card.Body className="p-0">
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.sales.length === 0 ? (
                    <MessageBox>No Sales</MessageBox>
                  ) : (
                    <>
                      {time === "month" ?
                        <Chart
                          style={{ overflow: "hidden" }}
                          width="100%"
                          height="400px"
                          chartType="ColumnChart"
                          options={{
                            hAxis: { title: "Weeks" }, // X-axis label
                            vAxis: { title: "Total Sales" }, // Y-axis label
                            colors: ["#00ab41"],
                          }}
                          data={[
                            ["Weeks", "Total Sales"],
                            ...summary.sales.map((x) => [`Week ${x.week}`, x.totalSales]),
                          ]}
                        ></Chart> :
                        <Chart
                          style={{ overflow: "hidden", top: 0 }}
                          width="100%"
                          height="400px"
                          chartType="ColumnChart"
                          options={{
                            hAxis: { slantedText: true, slantedTextAngle: 45, title: "Months" }, // X-axis label
                            vAxis: { title: "Total Sales" }, // Y-axis label
                            colors: ["#00ab41"],
                          }}
                          data={[
                            ["Month", "Total Sales"],
                            ...monthlySales(summary.sales)
                          ]}
                        ></Chart>
                      }
                      <div className="f-center graph-filter">
                        <Form.Group>
                          <Form.Check
                            inline
                            label="Month"
                            type="radio"
                            checked={time === "month"}
                            // name="filterOption"
                            // value="month"
                            onChange={(e) => { e.preventDefault(); setTime("month"); }}
                          />

                          <Form.Check
                            inline
                            label="Year"
                            type="radio"
                            checked={time === "year"}
                            // name="filterOption"
                            // value="year"
                            onChange={(e) => { e.preventDefault(); setTime("year"); }}
                          />
                        </Form.Group>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <ToastContainer />
        </>
      )}
    </MotionDiv >
  );
}
