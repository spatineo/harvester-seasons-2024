import React from "react";
import { Box } from "@mui/material";

const styles = {
  bottom: {
    marginBottom: "0.2em",
  },
};

const PrivacyPolicy: React.FC = () => {
  return (
    <Box
      sx={{
        width: "80%",
        margin: "auto",
        top: "2rem",
        position: "relative",
        fontFamily: "Lato",
      }}
    >
      <Box component={"h1"}>Privacy Policy</Box>
      <br />
      <Box>
        <Box component={"h2"}>Who we are </Box>
        <p>
          Our website address is: https://harvesterseasons.com. We are
          information service practitioners lead by the Finnish Meteorological
          Institute.
        </p>
      </Box>
      <br />
      <Box component={"h2"}>
        What personal data we collect and why we collect it{" "}
      </Box>
      <br />
      <Box>
        <Box component={"h3"}>Feedback forms </Box>
        <p>
          When visitors send us feedback using the form on the site, we collect
          the data shown in the feedback form, the coordinates of the locations
          shown on the map and time series, and also the visitor’s IP address to
          help spam detection.
        </p>
      </Box>
      <br />
      <Box>
        <Box component={"h3"}>Cookies </Box>
        <p>
          The site uses JavaScript components loaded from other locations that
          may use cookies. The site itself does not save any cookies.
        </p>
      </Box>
      <br />
      <Box>
        <Box component={"h3"}>Embedded content from other websites</Box>
        <p>
          The site contains embedded data from other FMI servers and map
          information from Thunderforest and National Land Survey of Finland.{" "}
        </p>
      </Box>
      <br />
      <Box>
        <Box component={"h2"}>Analytics</Box>
        <br />
        <Box component={"h3"} sx={{ marginBottom: "0.2em" }}>
          Who we share your data with
        </Box>
        <Box component={"h3"} sx={{ marginBottom: "0.2em" }}>
          How long we retain your data
        </Box>
        <p>
          If you send feedback, the message and its metadata are retained
          indefinitely.
        </p>
      </Box>
      <br />
      <Box>
        <Box component={"h3"} sx={styles.bottom}>
          What rights you have over your data
        </Box>
        <Box component={"h3"} sx={styles.bottom}>
          Where we send your data
        </Box>
        <Box component={"h3"} sx={{ marginBottom: "0.2em" }}>
          {" "}
          Our contact information
        </Box>
        <address>
          Finnish Meteorological Institute FMI, Arctic Space Center, Erik
          Palménin aukio 1, FIN-00560 Helsinki.
        </address>
      </Box>
      <br />
      <Box>
        <Box component={"h2"} sx={styles.bottom}>
          Additional information
        </Box>
        <Box component={"h3"}>How we protect your data </Box>
        <p>
          FMI is a governmental institute of Finland and fulfills Finnish and EU
          standards for data protection as prescribed.
        </p>
        <br />
        <Box component={"h3"} sx={styles.bottom}>
          What data breach procedures we have in place
        </Box>
        <p>
          FMI has appointed a security manager, that handles breach situations
          according to Finnish law requirements.{" "}
        </p>
        <br />
        <Box component={"h3"} sx={styles.bottom}>
          What third parties we receive data from{" "}
        </Box>
        <p>
          Visitor’s IP address is gathered using ipify API at
          https://www.ipify.org/.
        </p>
        <br />
        <Box component={"h3"} sx={styles.bottom}>
          What automated decision making and/or profiling we do with user data
        </Box>
        <p>We are not profiling our users.</p>
      </Box>
      <br />
      <Box component={"h1"}>Terms of Use</Box>
      <p>
        Reproduction of the publicly available content of this website is
        authorised, provided the source is acknowledged, save where otherwise
        stated.
      </p>
      <br />
      <Box component={"h3"} sx={styles.bottom}>
        Disclaimer
      </Box>
      <p>
        FMI maintains this website to enhance public access to information about
        the European Union’s Copernicus Programme. Our goal is to keep this
        information timely and accurate. If errors are brought to our attention,
        we will try to correct them. However, FMI accepts no responsibility or
        liability whatsoever with regard to the information on this site.
      </p>
      <br />
      <p>
        While abiding by the highest scientific and technical standards, FMI
        cannot warrant that any information provided by the service will be
        entirely free from errors or omissions or that such errors or omissions
        can or will be rectified entirely. This applies particularly to
        information, tools and data from projects that continue to be developed,
        but are made publicly available for the purpose of feedback and testing.
      </p>
      <br />
      <p>
        It is our goal to minimize disruption caused by technical errors.
        However, some data or information on our site may have been created or
        structured in files or formats that are not error-free and we cannot
        guarantee that our service will not be interrupted or otherwise affected
        by such problems. FMI accepts no responsibility with regard to such
        problems incurred as a result of using this site or any linked external
        sites. EC, ECMWF and FMI can’t be hold responsible for decisions based
        on the information presented in the application.
      </p>
      <br />
      <p>FMI may change material on the site without prior notice.</p>
      <br />
      <br />
      <br />
    </Box>
  );
};

export default PrivacyPolicy;
