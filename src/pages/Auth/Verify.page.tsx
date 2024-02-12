import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Button, Flex, Image, Text } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyUser } from '@/services/auth.service';
import BabcockLoader from '@/shared/components/BabcockLoader';
import logo from '@/assets/images/babcock-logo.png';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const id = searchParams.get('id') || '';
  const navigate = useNavigate();
  const { isFetching, isError } = useQuery({
    queryKey: ['verify-user'],
    queryFn: () => verifyUser({ token, id }),
  });
  return (
    <>
      {isFetching ? (
        <BabcockLoader />
      ) : (
        <Flex align="center" justify="center" h="100dvh" direction="column">
          <Image src={logo} w={80} h={80} />
          {!isError && (
            <>
              <Text>User Verified Successfully </Text>
              <Button w={200} mt={15} onClick={() => navigate('/login')}>
                Login
              </Button>
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default Verify;
