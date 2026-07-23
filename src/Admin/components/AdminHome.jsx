import { Box, Tabs } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import {
  FaTachometerAlt,
  FaEnvelopeOpenText,
  FaUserGraduate,
} from "react-icons/fa";
import Dashboard from "./Dashboard";
import EnquiriesList from "./Enquiries/EnquiriesList";
import StudentsList from "./Students/StudentsList";

const TABS = [
  { value: "dashboard", label: "Dashboard", icon: FaTachometerAlt, Component: Dashboard },
  { value: "enquiries", label: "Enquiries", icon: FaEnvelopeOpenText, Component: EnquiriesList },
  { value: "students", label: "Students", icon: FaUserGraduate, Component: StudentsList },
];
const VALID_TABS = TABS.map((t) => t.value);

export default function AdminHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = VALID_TABS.includes(requestedTab) ? requestedTab : "dashboard";

  const handleTabChange = (e) => {
    setSearchParams(e.value === "dashboard" ? {} : { tab: e.value });
  };

  return (
    <Box>
      <Tabs.Root value={activeTab} onValueChange={handleTabChange} variant="enclosed" colorPalette="blue">
        <Tabs.List mb={6} bg="white" rounded="lg" p={1} boxShadow="sm" flexWrap="wrap">
          {TABS.map((t) => (
            <Tabs.Trigger key={t.value} value={t.value} fontWeight={600} fontSize="sm">
              <Box as={t.icon} mr={2} fontSize="13px" />
              {t.label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator rounded="md" />
        </Tabs.List>

        {TABS.map(({ value, Component }) => (
          <Tabs.Content key={value} value={value} Component={Component}>
            <Component />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
}
