import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import { fetchAdminEnquiries } from "../../../pages/actions";
import { getAdminEnquiries } from "../../../pages/selectors";

export default function EnquiryDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const adminEnquiries = useSelector(getAdminEnquiries);

  useEffect(() => {
    dispatch(fetchAdminEnquiries());
  }, [dispatch]);

  const enquiry = adminEnquiries[Number(id)];

  if (!enquiry) {
    return (
      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md">
        <Text color="gray.500">Enquiry not found.</Text>
        <BackButton to="/admin/enquiries" label="Back to Enquiries" />
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Enquiries", to: "/admin/enquiries" },
          { label: enquiry.name },
        ]}
      />
      <BackButton to="/admin/enquiries" label="Back to Enquiries" />

      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md" maxW="800px" borderTop="4px solid" borderColor="#E91E8C">
        <Heading size="lg" color="#0C1222" mb={6}>{enquiry.name}</Heading>

        <VStack align="stretch" gap={4}>
          <Flex gap={{ base: 4, md: 8 }} wrap="wrap">
            <Box>
              <Text fontSize="xs" color="gray.400">Email</Text>
              <Text fontWeight={600} color="#0C1222">{enquiry.email}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.400">Phone</Text>
              <Text fontWeight={600} color="#0C1222">{enquiry.phone}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.400">District</Text>
              <Text fontWeight={600} color="#0C1222">{enquiry.district}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.400">Date</Text>
              <Text fontWeight={600} color="#0C1222">
                {enquiry.submittedAt ? new Date(enquiry.submittedAt).toLocaleDateString() : "—"}
              </Text>
            </Box>
          </Flex>

          <Box borderTop="1px solid" borderColor="gray.100" pt={4}>
            <Text fontSize="xs" color="gray.400" mb={2}>Message</Text>
            <Text color="gray.700">{enquiry.message}</Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
