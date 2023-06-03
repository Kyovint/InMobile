import Link from 'next/link';
import Image from 'next/image';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Avatar } from '@chakra-ui/avatar';
import { FaBed, FaBath } from 'react-icons/fa';
import { BsGridFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import millify from 'millify';

import DefaultImage from '../assets/images/house.jpg';
import { Card, Badge } from '@chakra-ui/react';


const Property = ({ property: {id, price,title, rooms, area, photos, baths} }) => (
  
  <Card style={{ borderStartEndRadius: '40px', borderTopLeftRadius: '40px', borderBottomLeftRadius: '40px', overflow: 'hidden' }} variant={'outline'} margin="2" backgroundColor={'gray.50'}>
  <Link href={`/property/${id}`} passHref>   
    <Flex flexWrap='wrap' w='400px' p='5' justifyContent='flex-start'  cursor='pointer' >
      <Box>
        <Image style={{borderStartEndRadius: '40px', borderTopLeftRadius: '40px', borderBottomLeftRadius: '40px', overflow: 'hidden' }} alt="post" src={photos[0]}  width={400} height={260} />
      </Box>
      <Box w="full" >
        <Flex paddingTop='2' alignItems='center' justifyContent='space-between'>
          <Flex alignItems='center'>
            <Text fontSize='lg' fontWeight='bold'>
              {title.length > 30 ? title.substring(0, 30) + '...' : title}
            </Text>
            
          </Flex>
          <Box>
            {/* <Avatar size='sm' src={agency?.logo?.url}></Avatar> */}
          </Box>
        </Flex>
        <Flex alignItems='center' p='1' justifyContent='space-between' w='250px' color='blue.400'>
          {rooms} <FaBed /> | {baths} <FaBath/>  | {area} mt2 <BsGridFill/>
        </Flex>
          <Text fontSize='lg'>{price} $</Text>
      </Box>
    </Flex>  
  </Link>
  </Card>

  
);

export default Property;
