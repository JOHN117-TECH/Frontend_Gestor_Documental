import { Box, Typography, Link, Container } from '@mui/material';
import ReactLogo from '../../assets/React.png';
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#9601fd',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          paddingTop="1rem"
          textAlign={{ xs: 'center', sm: 'left' }}
        >
          <img src={ReactLogo} alt="React Logo" />

          {/* Enlaces de navegación */}
          <Box display="flex" gap={2}>
            <Link href="/" color="inherit" underline="hover">
              Inicio
            </Link>
            <Link href="/about" color="inherit" underline="hover">
              Sobre nosotros
            </Link>
            <Link href="/contact" color="inherit" underline="hover">
              Contacto
            </Link>
          </Box>
        </Box>

        {/* Derechos de autor */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Mi Aplicación. Todos los derechos
            reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
