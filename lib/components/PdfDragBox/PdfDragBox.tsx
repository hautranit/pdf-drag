import {
  Ref,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Colors } from "./Colors";
import { SourceBox } from "./SourceBox";
import { StatefulTargetBox as TargetBox, TargetBoxRef } from "./TargetBox";
import { DndProvider } from "react-dnd";
import { pdfjs } from "react-pdf";
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./pdf.scss";
import { ContainerBoxItem, PdfDragBoxProps } from ".";
import { NotificationCircleOutlined } from "./icons";
import { MousePosition } from "./interfaces";
import WebFont from "webfontloader";
import { PdfDragBoxData, PdfRef } from "./PdfDragBox.types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfDragBoxComponent = (props: PdfDragBoxProps, ref: Ref<PdfRef>) => {
  const {
    itemsTitle = "Items",
    boxes = [],
    pdf,
    onSubmit,
    submitButton,
    loading,
    data,
    extraAction,
    onChangeData,
  } = props;

  const boxRef = useRef<TargetBoxRef>(null);

  const [mousePosition, setMousePosition] = useState<MousePosition>();
  const [boxesData, setBoxesData] = useState<PdfDragBoxData[]>(data ?? []);

  const getBoxes = () => {
    const boxesData = boxRef?.current?.getBoxes();

    return boxesData ?? [];
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const boxesData = getBoxes();
      onSubmit(boxesData);
    }
  };

  const handleChangeMousePosition = (position: MousePosition) => {
    setMousePosition(position);
  };

  const hanldeChangeData = (data: ContainerBoxItem[]) => {
    if (onChangeData) {
      onChangeData(data);
    }
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Droid Sans", "Roboto", "Chilanka"],
      },
    });
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        updateData: (dataT: ContainerBoxItem[] | PdfDragBoxData[]) => {
          const newData: PdfDragBoxData[] = [];

          dataT.forEach((item: any) => {
            const newItem: PdfDragBoxData = {
              id: item.id,
              image: item.image,
              page: item.page,
              title: item.id?.toString(),
              position: {
                height: item.height,
                width: item.width,
                left: item.left,
                top: item.top,
              },
              texts: item.texts ?? [],
              isShowImage: item.isShowImage,
              resizable: item.resizable,
              coordinates: item.coordinates,
            };
            newData.push(newItem);
          });
          setBoxesData(newData);
        },
      };
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pdf-drag-box">
        {pdf ? (
          <div
            style={{
              overflow: "hidden",
              clear: "both",
              margin: "-.5rem",
              display: "flex",
            }}
          >
            <div className="boxes-section">
              <div
                className="flex justify-space-between align-center flex-wrap"
                style={{ margin: "10px 0" }}
              >
                <div
                  className="text-center text-bold block"
                  style={{ padding: "5px 10px" }}
                >
                  {itemsTitle}
                </div>
              </div>

              {boxes.map((box) => (
                <SourceBox
                  key={box.id}
                  color={Colors.BLUE}
                  item={{
                    ...box,
                    resizable:
                      box.resizable !== undefined ? box.resizable : true,
                    texts: box.texts ?? [],
                    isShowImage:
                      box.isShowImage === undefined ? true : box.isShowImage,
                  }}
                  onMouseClick={handleChangeMousePosition}
                >
                  <div style={{ fontSize: 12, textAlign: "center" }}>
                    <b>{box.title}</b>
                    <div>{box.text}</div>
                  </div>
                </SourceBox>
              ))}
            </div>
            <div className="pdf-drag-section">
              <TargetBox
                ref={boxRef}
                pdf={pdf}
                data={boxesData as any}
                extraAction={
                  extraAction && {
                    ...extraAction,
                    onClick: (bd, dt) => extraAction.onClick(bd, dt ?? []),
                  }
                }
                mousePosition={mousePosition}
                onChangeData={hanldeChangeData}
              />
            </div>
            <div className="pdf-drag-actions">
              <div className="pdf-drag-extra">{props.extra}</div>
              <button
                className="pdf-drag-submit-btn"
                onClick={handleSubmit}
                style={submitButton?.style}
                disabled={loading}
              >
                {loading && (
                  <div className="pdf-drag-submit-btn__icon">
                    <NotificationCircleOutlined className="btn-loading" />
                  </div>
                )}
                {submitButton?.text ?? "Submit"}
              </button>
            </div>
          </div>
        ) : (
          <h1>
            <b>Where is the pdf ? ! ? ! ? ! ? </b>
          </h1>
        )}
      </div>
    </DndProvider>
  );
};

const PdfDragBox = forwardRef(PdfDragBoxComponent);
export default PdfDragBox;
