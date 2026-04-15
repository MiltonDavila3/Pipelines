import { useForm } from "react-hook-form";
import { registerSchema, type RegisterSchema } from "../../../lib/schemas/registerSchema";
import { useRegisterMutation } from "./accountApi"
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutline } from "@mui/icons-material";
import { Container, Paper, Box, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function RegisterForm() {
    const [registerUser] = useRegisterMutation();
    const {register, handleSubmit, setError, formState: {errors, isValid, isLoading}} = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema)
    });
    const onSubmit = async (data: RegisterSchema) => {
        try {
          await registerUser(data).unwrap();
        } catch (error) {
          const apiError = error as {message: string};
          if (apiError.message && typeof apiError.message === 'string') {
            const errorArray = apiError.message.split(',');
            errorArray.forEach(err => {
              if(err.includes('Password')){
                setError('password', {message: err});
              }
              else if (err.includes('Email')){
                setError('email', {message: err});
              }
            })
          }
        }
    }
  return (
    <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={8}
      >
        <LockOutline sx={{ mt: 3, color: "secondary.main" }} />
        <Typography variant="h6">Register</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          width="100%"
          display="flex"
          flexDirection="column"
          gap={3}
          marginY={3}
        >
          <TextField
            fullWidth
            label="Email Address"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button variant="contained" type="submit" disabled={isLoading || !isValid}>
            Register
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?
            <Typography
              sx={{ ml: 2 }}
              component={Link}
              to="/login"
              color="primary"
            >
              Sign In
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}