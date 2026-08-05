import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Flex, Heading, Input, Table, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import { fetchAdminEnquiries } from "../../../pages/actions";
import { getAdminEnquiries, getAdminEnquiriesLoading } from "../../../pages/selectors";

const PAGE_SIZE = 5;

export default function EnquiriesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminEnquiries = useSelector(getAdminEnquiries);
  const enquiriesLoading = useSelector(getAdminEnquiriesLoading);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminEnquiries());
  }, [dispatch]);

 const enquiries = useMemo(
    () => adminEnquiries.map((e, index) => ({ ...e, id: index })),
    [adminEnquiries]
  );

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      return (
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.district.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [enquiries, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Enquiries" }]} />

      <Heading mb={1} color="#0C1222">Enquiries</Heading>
      <Text color="gray.500" mb={{ base: 4, md: 8 }}>Manage student enquiries and support requests</Text>

      <Box bg="white" rounded="xl" shadow="md" p={{ base: 4, md: 6 }}>
        <Box position="relative" maxW={{ md: "320px" }} w="100%" mb={6}>
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
            pointerEvents="none"
          >
            <FaSearch size={13} />
          </Box>
          <Input
            pl="34px"
            placeholder="Search by name, email or district"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            borderColor="gray.200"
            borderWidth="2px"
            rounded="lg"
            _focus={{ borderColor: "#039BE5", boxShadow: "0 0 0 3px rgba(3,155,229,0.12)" }}
          />
        </Box>

        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Phone</Table.ColumnHeader>
                <Table.ColumnHeader>District</Table.ColumnHeader>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((e) => (
                <Table.Row key={e.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight={600} color="#0C1222">
                    <Text fontSize="sm">{e.name}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{e.phone}</Table.Cell>
                  <Table.Cell color="gray.600">{e.district}</Table.Cell>
                  <Table.Cell color="gray.600">
                    {e.submittedAt ? new Date(e.submittedAt).toLocaleDateString() : "—"}
                  </Table.Cell>
                  <Table.Cell>
                    <Box
                      as="button"
                      onClick={() => navigate(`/admin/enquiries/${e.id}`)}
                      color="#039BE5"
                      fontWeight={600}
                      fontSize="sm"
                      _hover={{ textDecoration: "underline" }}
                    >
                      View
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ))}

              {!enquiriesLoading && filtered.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No enquiries found.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <Pagination count={filtered.length} pageSize={PAGE_SIZE} page={page} onPageChange={setPage} />
      </Box>
    </>
  );
}
