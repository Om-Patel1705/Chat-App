import { Stack ,Box} from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { dotStream } from "ldrs";

dotStream.register();


const ChatLoading = () => {
  return (
    <Box    alignSelf="center"
                margin="auto">
                <l-dot-stream
                  size="100"
                  speed="2.5"
                  color="Black"
                ></l-dot-stream>
              </Box>
  );
};

export default ChatLoading;