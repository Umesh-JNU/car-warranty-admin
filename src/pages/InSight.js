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
              <h3>InSights</h3>
            </Col>
            <Col md={6}></Col>
          </Row>

          <Container className="container-md">

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
            <Card className="mb-3">
              <Card.Header className="card-header-primary">
                Refund Report
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <Skeleton count={5} height={30} />
                ) : summary.sales.length === 0 ? (
                  <MessageBox>No Refund</MessageBox>
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
          </Container>

          <ToastContainer />
        </>
      )}
    </MotionDiv >
  );
}
