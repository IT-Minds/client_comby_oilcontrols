import { Container } from "@chakra-ui/react";
import { ReportForm } from "components/Reporting/ReportForm";
import ReportingComp from "components/Reporting/ReportingComponent";
import { NextPage } from "next";
import { useState } from "react";

const DemoPage: NextPage = () => {
  const [reportForm, setReportForm] = useState<ReportForm>(null);

  return (
    <Container maxW="xl" centerContent>
      <ReportingComp
        submitCallback={setReportForm}
        carId="12345"
        locations={[
          { name: "Build 1", id: "1" },
          { name: "Build 2", id: "2" },
          { name: "Build 3", id: "3" }
        ]}
        couponNumbers={[
          { name: "Coupon 1", id: "1" },
          { name: "Coupon 2", id: "2" },
          { name: "Coupon 3", id: "3" }
        ]}
        fillTypes={[
          { name: "Oil", id: "1" },
          { name: "Gas", id: "2" },
          { name: "Something else", id: "3" }
        ]}></ReportingComp>
    </Container>
  );
};

export default DemoPage;
