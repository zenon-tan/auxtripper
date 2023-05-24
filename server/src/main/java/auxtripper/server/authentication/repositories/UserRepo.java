package auxtripper.server.authentication.repositories;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import auxtripper.server.authentication.models.User;

@Repository
public class UserRepo {

    @Autowired
    JdbcTemplate jdbcTemplate;

    private static final String FIND_USER_BY_USERNAME = """
            select * from userData where username = ?
            """;

    private static final String INSERT_NEW_USER = """
            insert into userData(firstName, lastName, email, username, password, role)
            values(?, ?, ?, ?, ?, ?)
            """;

    public Optional<User> findByUsername(String username) {

        User result = jdbcTemplate.query(FIND_USER_BY_USERNAME, new BeanPropertyRowMapper().newInstance(User.class), username).get(0);
        if(result == null) {
            return Optional.empty();
        }
        return Optional.of(result);
        
    }

    public void insertNewUser(User user) {
        jdbcTemplate.update(INSERT_NEW_USER, user.getFirstName(), user.getLastName(), user.getEmail(), user.getUsername(), user.getPassword(), user.getRole().name());
    }
    
}
