import { Flex, Image } from '@mantine/core';
import logo from '@/assets/images/babcock-logo.png';
import classes from '../styles/Layout.module.css';

const BabcockLoader = () => (
  <>
    <Flex w="100%" h="100dvh" justify="center" align="center" className={classes.loader}>
      <Image src={logo} w={80} h={80} />
    </Flex>
  </>
);

export default BabcockLoader;
