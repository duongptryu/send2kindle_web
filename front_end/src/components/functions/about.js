import React from "react";
import { Row, Col, Divider, Image } from "antd";

function About() {
  return (
    <div style={{ width: "70%", margin: "0 auto", marginBottom:"30px"}}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "70px" }}>🅰🅱🅾🆄🆃 🆄🆂</h1>
      </div>
      <Divider orientation="left">Facebook</Divider>
      <Row>
        <Col span={2}>
          <Image
            width={60}
            src="https://i.pinimg.com/originals/30/99/af/3099aff4115ee20f43e3cdad04f59c48.png"
            style={{ float: "left" }}
          />
        </Col>
        <Col>
          <h1 style={{ marginTop: "10px" }}>Facebook.com</h1>
        </Col>
      </Row>

      <Divider orientation="left">GitHub</Divider>
      <Row>
        <Col span={2}>
          <Image
            width={60}
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          />
        </Col>
        <Col>
          <h1 style={{ marginTop: "10px" }}>Github.com</h1>
        </Col>
      </Row>

      <Divider orientation="left">Gmail</Divider>
      <Row>
        <Col span={2}>
          <Image
            width={60}
            src="https://1000logos.net/wp-content/uploads/2018/05/Gmail-logo.png"
          />
        </Col>
        <Col>
          <h1 style={{ marginTop: "10px" }}>Gmail.com</h1>
        </Col>
      </Row>
      <Divider orientation="left">Viber</Divider>
      <Row>
        <Col span={2}>
          <Image
            width={60}
            src="https://1000logos.net/wp-content/uploads/2020/08/Viber-Logo.png"
          />
        </Col>
        <h1>Viber.com</h1>
        <Col></Col>
      </Row>
    </div>
  );
}

export default About;
