import { ButtonGroup, IconButton, Pagination as ChakraPagination } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ count, pageSize, page, onPageChange }) {
  if (count <= pageSize) return null;

  return (
    <ChakraPagination.Root
      count={count}
      pageSize={pageSize}
      page={page}
      onPageChange={(e) => onPageChange(e.page)}
      mt={6}
    >
      <ButtonGroup variant="ghost" size="sm" gap={1} justifyContent="flex-end" w="100%">
        <ChakraPagination.PrevTrigger asChild>
          <IconButton aria-label="Previous page">
            <ChevronLeft size={16} />
          </IconButton>
        </ChakraPagination.PrevTrigger>

        <ChakraPagination.Items
          render={(pg) => (
            <IconButton
              variant={{ base: "ghost", _selected: "solid" }}
              bg={{ _selected: "#0B1E35" }}
              color={{ _selected: "white" }}
              _hover={{ bg: "gray.100" }}
            >
              {pg.value}
            </IconButton>
          )}
        />

        <ChakraPagination.NextTrigger asChild>
          <IconButton aria-label="Next page">
            <ChevronRight size={16} />
          </IconButton>
        </ChakraPagination.NextTrigger>
      </ButtonGroup>
    </ChakraPagination.Root>
  );
}
