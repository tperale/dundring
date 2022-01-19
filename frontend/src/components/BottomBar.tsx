import * as React from 'react';
import {
  Center,
  Link,
  Stack,
  Text,
  Grid,
  HStack,
  Flex,
} from '@chakra-ui/layout';
import { useAvailability } from '../hooks/useAvailability';
import { Icon, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { Logo } from './Logo';
import { LogModal } from './Modals/LogModal';
import { Github, Slack } from 'react-bootstrap-icons';
import { MainActionBar } from './MainActionBar';
import { Lap } from '../types';

interface Props {
  start: () => void;
  stop: () => void;
  running: boolean;
  data: Lap[];
}
export const BottomBar = (props: Props) => {
  const { available: bluetoothIsAvailable } = useAvailability();
  const bgColor = useColorModeValue('gray.200', 'gray.900');
  return (
    <Center width="100%" position="fixed" bottom="0" pointerEvents="none">
      <Stack width="100%" spacing="0">
        <MainActionBar {...props} />
        <Grid
          backgroundColor={bgColor}
          width="100%"
          templateColumns="1fr 4fr 1fr"
          pointerEvents="auto"
        >
          <Flex p="1">
            <Logo height="20px" />
          </Flex>
          <LogModal />
          <HStack justifyContent="flex-end" paddingX="2">
            <Tooltip label="Visit the workspace on Slack">
              <Link
                href="https://join.slack.com/t/dundring/shared_invite/zt-10g7cx905-6ugYR~UdMEFBAkwdSWOAew"
                p="0"
              >
                <Icon as={Slack} p="0" />
              </Link>
            </Tooltip>
            <Tooltip label="Visit the repository on GitHub">
              <Link href="https://github.com/sivertschou/dundring">
                <Icon as={Github} />
              </Link>
            </Tooltip>
          </HStack>
        </Grid>
        {!bluetoothIsAvailable ? (
          <Center p="2" backgroundColor="red">
            <Text fontSize="l">
              Bluetooth is not available in this browser yet. Check{' '}
              <Link
                textDecor="underline"
                href="https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth#browser_compatibility"
              >
                the docs for browsers supporting Bluetooth
              </Link>
              .
            </Text>
          </Center>
        ) : null}
      </Stack>
    </Center>
  );
};
