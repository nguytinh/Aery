import Link, { LinkProps } from "next/link";
import {
    Link as ChakraLink,
    LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";

type ChakraLinkAndNextProps = ChakraLinkProps & LinkProps;

function ChakraNextLink({ href, children, ...props }: ChakraLinkAndNextProps) {
    return (
        <Link href={href} passHref>
            <ChakraLink {...props}>{children}</ChakraLink>
        </Link>
    );
}

export { ChakraNextLink as Link };
