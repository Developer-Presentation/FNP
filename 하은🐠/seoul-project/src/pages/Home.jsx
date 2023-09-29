import {styled} from "styled-components";
import React, {useState, useEffect} from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import seoulProjectApi from "../API/seoulProjectApi";

const Home = () => {
  const [seoulList, setSeoulList] = useState([]);
  const [startValue, setStartValue] = useState(0);

  const fetchSeoulList = async (start) => {
    try {
      const listData = await seoulProjectApi().getSeoulList(start);
      console.log("List data:", listData);

      setSeoulList((prevList) => {
        let updatedList = [];
        if (prevList && prevList.row) {
          updatedList = [...prevList.row, ...(listData.row || [])];
        } else {
          updatedList = [...(listData.row || [])];
        }

        return {...prevList, row: updatedList}; // Ensure prevList is an object with a 'row' property
      });

      setStartValue(start + 30);
    } catch (error) {
      console.error("데이터 가져오기 오류: ", error);
    }
  };

  const handleInfiniteScroll = () => {
    fetchSeoulList(startValue);
  };

  const [isFetching] = useInfiniteScroll(handleInfiniteScroll);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listData = await seoulProjectApi().getSeoulList(startValue);
        console.log("List data:", listData);
        setSeoulList(listData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [startValue]);

  return (
    <>
      <Header>
        <HeaderInner>
          <h1>SeoulProject</h1>
        </HeaderInner>
      </Header>
      <Main>
        <InfoSection>
          <h2>서울 문화 리스트:</h2>
          <DetaList>
            {seoulList && seoulList.row?.length > 0 ? (
              seoulList.row.map((item, index) => (
                <li key={index}>
                  <h3>{item.TITLE}</h3>
                  <p>{item.DATE}</p>
                </li>
              ))
            ) : (
              <li>돌아가</li>
            )}
          </DetaList>
        </InfoSection>
      </Main>
    </>
  );
};

const Header = styled.header`
  width: 100%;
  padding: 2rem 0;
  border-bottom: 1px solid gray;
  margin-bottom: 2rem;
  position: fixed;
  background-color: #ffffff;
`;
const HeaderInner = styled.div`
  /* border: 1px solid green; */
  width: 90%;
  /* padding: 2rem */
  margin: 0 auto;

  h1 {
    display: inline-block;
  }

  p {
    /* border: 1px solid navy; */
  }
`;

const Main = styled.main`
  padding-top: 10rem;
`;

const InfoSection = styled.div`
  /* border: 1px solid blue; */
  width: 90%;
  margin: 0 auto;
  h2 {
    font-size: 30px;
    margin-bottom: 10px;
  }
`;

const DetaList = styled.ul`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;

  li {
    border: 1px solid grey;
    border-radius: 5px;
    /* flex-wrap: nowrap; */
    width: 17%;
    padding: 10px;
  }

  h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 20px;
    margin: 20px 0;
  }

  p {
    font-size: 12px;
  }

  @media (max-width: 992px) {
    li {
      width: calc(33.333% - 20px);
    }
  }

  @media (max-width: 768px) {
    li {
      width: calc(50% - 20px);
    }
  }

  @media (max-width: 576px) {
    li {
      width: 100%;
    }
  }
`;

export default Home;
