import React, { useCallback, useRef, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import pdf from "./pdf2.pdf";
import {
  ContainerBoxItem,
  PdfDragBox,
  PdfDragBoxData,
  PdfDragBoxProps,
} from "../../lib/components/PdfDragBox";
import { EditOutlined } from "../../lib/components/PdfDragBox/icons/EditOutlined";
import { PdfRef } from "../../lib/components/PdfDragBox/PdfDragBox.types";

import A from "./getSignatureSmartCAImageById.png";

const meta: Meta = {
  title: "PdfDragBox",
  component: PdfDragBox,
};

export default meta;
const Template: StoryFn<PdfDragBoxProps> = (args: PdfDragBoxProps) => {
  const ref = useRef<PdfRef>(null);

  const handleClick1 = (dataT: PdfDragBoxData[]) => {
    const newData = dataT.map((item) => {
      return { ...item, texts: [] };
    });
    ref.current?.updateData(newData);
  };

  return (
    <PdfDragBox
      {...args}
      itemsTitle="Signatures"
      ref={ref}
      boxes={[
        {
          id: A,
          image: A,
          width: 120,
          height: 60,
          title: "kyso@vntt.com.vn",
          multiple: true,
          text: "Chữ ký mặc định của công ty",
          resizable: true,
          texts: [
            { text: "haajutran@gmail.com" },
            { text: "SIGNATURE SIGNATURE SIGNATURE SIGNATURE" },
          ],
        },
        // {
        //   id: A,
        //   image: A,
        //   multiple: true,
        //   text: "Ký số cá nhân",
        //   resizable: true,
        //   width: 100,
        //   height: 100,
        //   imageType: "fill",
        // },
      ]}
      pdf={pdf}
      onSubmit={(a) => {
        console.log(a);
      }}
      data={[
        {
          id: "https://vsip-workflow.becawork.vn/api/personalProfiles/11162/getSignatureSmartCAImageById",
          image:
            "https://vsip-workflow.becawork.vn/api/personalProfiles/11162/getSignatureSmartCAImageById",
          page: 1,
          title: "",
          coordinates: [193, 320, 256, 380],
          resizable: true,
          texts: [
            {
              text: "Email: null",
            },
            {
              text: "Signed by: Công ty Cổ phần\n  đầu tư và phát triển Becamex",
            },
            {
              text: "Signed at: 09/05/2024 10:03",
            },
          ],
        },
      ]}
      extraAction={{
        icon: <EditOutlined />,
        title: "Edit",
        onClick: (item, data) => {
          handleClick1(data);
          // ref.current?.updateData(boxData);
          // handleClick();
          //
        },
      }}
    />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  submitButton: {
    text: "Submit",
  },
  data: [
    // {
    //   page: 1,
    //   title: "sadsadsa",
    //   coordinates: [446, 463, 546, 483],
    //   image:
    //     "https://library.vntts.vn/api/PublicLibrary/ViewFile/d5n7td7u1n4rlvyukpo15zlsz1idyxxgs6k1owfo6hud98aw4m",
    // },
  ],
};
