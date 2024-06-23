import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, admin ,handleFunction}) => {

    // console.log(user);
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
     
    >
      {user.username}
      {admin === user.id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;