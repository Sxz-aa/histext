
interface ArrowCellProps {
  children?: React.ReactNode;
}

export const ArrowCell = ({ children }: ArrowCellProps) => {
  return (
    <td style={{ 
      width: '8px',
      position: 'relative',
      padding: 0
    }}>
      {children}
      <div style={{
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          width: '3px',
          height: '1px',
          backgroundColor: 'white',
          marginRight: '1px'
        }} />
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '2px solid transparent',
          borderRight: '2px solid transparent',
          borderTop: '3px solid white'
        }} />
      </div>
    </td>
  );
};
