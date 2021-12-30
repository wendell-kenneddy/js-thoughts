import { Button, ButtonProps, useBreakpointValue } from "@chakra-ui/react";

interface FetchNextPageButtonProps extends ButtonProps {}

export function FetchNextPageButton({ ...rest }: FetchNextPageButtonProps) {
  const isWideVersion = useBreakpointValue({
    base: false,
    md: true,
  });

  return (
    <Button colorScheme="yellow" size={isWideVersion ? "md" : "sm"} {...rest}>
      Carregar mais
    </Button>
  );
}
