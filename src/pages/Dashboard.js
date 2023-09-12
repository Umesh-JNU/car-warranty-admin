import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Store } from "../states/store";
// icons
import { BiSolidShieldX } from "react-icons/bi";
import { HiShieldCheck } from "react-icons/hi";
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
  const [time, setTime] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
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
                  <Link to="/admin/warranty" className="small-box-footer">
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
                  <Link to="/admin/warranty" className="small-box-footer">
                    More info {<FaArrowCircleRight />}
                  </Link>
                </div>
              )}
            </Col>
          </Row>

          <Row className="my-4">
            <Col sm={6}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">
                  Sales Report
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.sales.length === 0 ? (
                    <MessageBox>No Sales</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="ColumnChart"
                      options={{
                        chart: {
                          title: "Count",
                          titleTextStyle: { color: "#1fd655" },
                        },
                        hAxis: { title: "Weeks" }, // X-axis label
                        vAxis: { title: "Total Sales" }, // Y-axis label
                        colors: ["#00ab41"],
                      }}
                      data={[
                        ["Weeks", "Total Sales"],
                        ...summary.sales.map((x) => [`Week ${x.week}`, x.totalSales]),
                      ]}
                    ></Chart>
                    // <Chart
                    //   width="100%"
                    //   height="400px"
                    //   chartType="BarChart"
                    //   // loader={<div>Loading Users...</div>}
                    //   options={{
                    //     bars: "vertical",
                    //     chart: {
                    //       title: "Count",
                    //       titleTextStyle: { color: "#1fd655" },
                    //     },

                    //     colors: ["#00ab41"],
                    //   }}
                    //   data={[
                    //     ["Total Sales", "Weeks"],
                    //     ...summary.sales.map((x) => [x.totalSales, `Week ${x.week}`]),
                    //   ]}
                    // ></Chart>
                  )}
                </Card.Body>
              </Card>
            </Col>
            {/* <Col sm={6}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">
                  Orders
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.dailyOrders.length === 0 ? (
                    <MessageBox>No Orders</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      // loader={<div>Loading Orders...</div>}
                      options={{
                        vAxis: {
                          title: "Count",
                          titleTextStyle: { color: "#1fd655" },
                        },

                        colors: ["#00c04b"],
                      }}
                      data={[
                        ["Date", "Count"],
                        ...summary.dailyOrders.map((x) => [x._id, x.total]),
                      ]}
                    ></Chart>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">
                  Total Order Amount
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.dailyPayments.length === 0 ? (
                    <MessageBox>No Payments Added</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      // loader={<div>Loading Payments...</div>}
                      options={{
                        vAxis: {
                          title: "Count",
                          titleTextStyle: { color: "#1fd655" },
                        },

                        colors: ["#90EE90"],
                      }}
                      data={[
                        ["Date", "Count"],
                        ...summary.dailyPayments.map((x) => [x._id, x.total]),
                      ]}
                    ></Chart>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="mb-3">
                <Card.Header className="card-header-primary">
                  Total Product Quantity
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <Skeleton count={5} height={30} />
                  ) : summary.dailyQuantity.length === 0 ? (
                    <MessageBox>No Orders</MessageBox>
                  ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="AreaChart"
                      // loader={<div>Loading Products...</div>}
                      options={{
                        vAxis: {
                          title: "Count",
                          titleTextStyle: { color: "#1fd655" },
                        },

                        colors: ["#90EE90"],
                        // title: "Subscriptions",
                      }}
                      data={[
                        ["Date", "Count"],
                        ...summary.dailyQuantity.map((x) => [x._id, x.total]),
                      ]}
                    ></Chart>
                  )}
                </Card.Body>
              </Card>
            </Col> */}
          </Row>

          <ToastContainer />
        </>
      )}
    </MotionDiv>
  );
}

// import React from 'react'

// const Dashboard = () => {
//   return (
//     <div>Dashboard</div>
//   )
// }

// export default Dashboard;